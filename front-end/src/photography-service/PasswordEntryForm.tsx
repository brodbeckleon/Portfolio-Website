import { useState } from "react";

const AccessProject = () => {
    const [password, setPassword] = useState("");
    const handleSubmit = async () => {
        const res = await fetch("/api/access", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project_id: "project123", password }),
        });

        if (res.ok) {
            window.location.href = `/gallery/project123`;
        } else {
            alert("Incorrect password");
        }
    };

    return (
        <div>
            <h2>Enter Project Password</h2>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSubmit}>Access Photos</button>
        </div>
    );
};

export default AccessProject;
