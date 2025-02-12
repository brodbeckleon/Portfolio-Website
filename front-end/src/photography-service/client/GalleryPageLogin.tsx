// GalleryLoginPage.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function GalleryLoginPage() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { projectId } = useParams();

    const handleSubmit = async () => {
        // Send login request; the endpoint should return a JSON object containing a JWT token.
        const res = await fetch("/api/access", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project_id: Number(projectId), password }),
        });

        if (res.ok) {
            const data = await res.json();
            const token = data.token;
            // Decide which storage key to use.
            // For example, if projectId is "admin" (or if you have a flag in the response),
            // store the token as an admin token.
            if (projectId === "admin") {
                sessionStorage.setItem("galleryAdminToken", token);
            } else {
                sessionStorage.setItem(`galleryToken_${projectId}`, token);
            }
            navigate(`/gallery/${projectId}`);
        } else {
            alert("Wrong password!");
        }
    };

    return (
        <div>
            <h2>Enter password for project {projectId}</h2>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Access</button>
        </div>
    );
}
