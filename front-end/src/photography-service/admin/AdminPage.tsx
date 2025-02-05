import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
    id: string;
    projectName: string;
    images: string[];
}

const AdminPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectName, setProjectName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const navigate = useNavigate();

    // Fetch existing projects from the backend
    async function fetchProjects() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/fetchProjects', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setProjects(data);
                } else {
                    setProjects([]);
                }
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setProjects([]);
        }
    }

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle file input changes
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(event.target.files);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Handle adding a new project
    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectName) {
            alert('Please enter a project name');
            return;
        }

        if (!selectedFiles || selectedFiles.length === 0) {
            alert('Please select at least one image');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        const formData = new FormData();
        formData.append('name', projectName);

        // Append all selected files
        Array.from(selectedFiles).forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch('http://localhost:3000/api/addProject', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Note: We do NOT set 'Content-Type' manually for multipart/form-data
                },
                body: formData,
            });

            if (response.ok) {
                // Refresh the project list after successful addition
                setProjectName('');
                setSelectedFiles(null);
                fetchProjects();
            } else {
                console.error('Failed to add project');
            }
        } catch (err) {
            console.error('Error adding project:', err);
        }
    };

    const openProject = (projectId: string) => {
        navigate(`/gallery/${projectId}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Page</h1>
            <button onClick={handleLogout} style={{ float: 'right' }}>
                Logout
            </button>

            <section>
                <h2>Existing Projects</h2>
                {projects.map((project) => {
                    const firstImage =
                        project.images && project.images.length > 0
                            ? project.images[0]
                            : null;

                    const imageUrl = firstImage
                        ? `/api/slides?image=galleries/${project.projectName}/${firstImage}`
                        : '';

                    return (
                        <div
                            key={project.id}
                            style={{
                                marginBottom: '20px',
                                cursor: 'pointer',
                                border: '1px solid #ccc',
                                padding: '10px',
                                width: '200px'
                            }}
                            onDoubleClick={() => openProject(project.id)}
                        >
                            <h3>{project.projectName}</h3>
                            {firstImage && (
                                <img
                                    src={imageUrl}
                                    alt={`${project.projectName} thumbnail`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2>Add New Project</h2>
                <form onSubmit={handleAddProject}>
                    <div>
                        <label htmlFor="projectName">Project Name: </label>
                        <input
                            type="text"
                            id="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <label htmlFor="images">Images: </label>
                        <input
                            type="file"
                            id="images"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit">Add Project</button>
                </form>
            </section>
        </div>
    );
};

export default AdminPage;
