import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DragAndDropUpload from './../../components/DragAndDropUpload'; // adjust the path as needed
import './AdminPage.css';

interface Project {
    id: string;
    projectName: string;
    images: string[];
}

const AdminPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectName, setProjectName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const navigate = useNavigate();

    async function fetchProjects() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/fetchProjects', {
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDeleteProject = async (projectId: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`/api/deleteProject/${projectId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setProjects((prevProjects) =>
                    prevProjects.filter((project) => project.id !== projectId)
                );
            } else {
                console.error('Failed to delete project');
            }
        } catch (err) {
            console.error('Error deleting project:', err);
        }
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectName) {
            alert('Please enter a project name');
            return;
        }

        if (selectedFiles.length === 0) {
            alert('Please select at least one image');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        const formData = new FormData();
        formData.append('name', projectName);
        Array.from(selectedFiles).forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch('/api/addProject', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                setProjectName('');
                setSelectedFiles([]);
                await fetchProjects();
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
        <div>
            <div className="admin-header">
                <h1>Admin Page</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div id="admin-container">
                <section className="existing-projects">
                    <h2>Existing Projects</h2>
                    <div className="project-cards">
                        {projects.map((project) => {
                            const firstImage =
                                project.images && project.images.length > 0
                                    ? project.images[0]
                                    : null;
                            const imageUrl = firstImage
                                ? `/api/image?image=galleries/${firstImage}`
                                : '';

                            return (
                                <div
                                    className="project-card"
                                    key={project.id}
                                    onDoubleClick={() => openProject(project.id)}
                                >
                                    {firstImage && (
                                        <img
                                            src={imageUrl}
                                            alt={`${project.projectName} thumbnail`}
                                        />
                                    )}
                                    <button onClick={() => handleDeleteProject(project.id)}>
                                        x
                                    </button>
                                    <h3>{project.projectName}</h3>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="add-project">
                    <h2>Add New Project</h2>
                    <form onSubmit={handleAddProject}>
                        <label htmlFor="projectName">Project Name: </label>
                        <input
                            type="text"
                            id="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                        <label htmlFor="images">Images: </label>
                        <DragAndDropUpload
                            onFilesSelected={(files) => setSelectedFiles(files)}
                            multiple={true}
                            accept="image/*"
                        />
                        <button type="submit">Add Project</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default AdminPage;
