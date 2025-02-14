import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header.tsx";

export default function GalleryLoginPage() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { projectId } = useParams();

    const checkAdminToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            sessionStorage.setItem("galleryAdminToken", token);
            navigate(`/gallery/${projectId}`);
        }
    }

    useEffect(() => {
        checkAdminToken();
    }, []);

    const handleSubmit = async () => {
        const res = await fetch("/api/galleryLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project_id: Number(projectId), password }),
        });

        if (res.ok) {
            const data = await res.json();
            const token = data.token;
            sessionStorage.setItem(`galleryToken_${projectId}`, token);
            navigate(`/gallery/${projectId}`);
        } else {
            alert("Wrong password!");
        }
    };

    return (
        <>
        <Header />
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            backgroundColor: 'white',
        }}>
            <div style={{
                textAlign: 'center',
                gap: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <h2>Enter password for project {projectId}</h2>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSubmit}>Access</button>
            </div>
        </div>
        </>
    );
}