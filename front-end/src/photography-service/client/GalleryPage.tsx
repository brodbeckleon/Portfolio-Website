// GalleryPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './GalleryPage.css';
import Header from "../../components/Header.tsx";

interface Project {
    id: number;
    projectName: string;
    images: string[];
}

const GalleryPage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [visibleImages, setVisibleImages] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalImgSrc, setModalImgSrc] = useState<string>('');
    const [modalImgCaption, setModalImgCaption] = useState<string>('');

    // Check for a valid token (project-specific or admin) on mount.
    useEffect(() => {
        const token =
            sessionStorage.getItem(`galleryToken_${projectId}`) ||
            sessionStorage.getItem("galleryAdminToken");
        if (!token) {
            navigate(`/galleryLogin/${projectId}`); // Redirect to login if token missing.
        }
    }, [projectId, navigate]);

    // Fetch project data with the token in the Authorization header.
    const fetchProject = useCallback(async () => {
        if (!projectId) return;
        const token =
            sessionStorage.getItem(`galleryToken_${projectId}`) ||
            sessionStorage.getItem("galleryAdminToken");
        console.log("🟢 Fetching project:", projectId);

        try {
            const res = await fetch(`/api/fetchProject?projectId=${projectId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                console.error("❌ Failed to fetch project:", res.statusText);
                return;
            }
            const data: Project = await res.json();
            console.log("✅ Project data received:", data);
            setProject(data);
        } catch (err) {
            console.error("❌ Error fetching project:", err);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    const loadMoreImages = useCallback(() => {
        if (!project || !project.images) {
            console.log("❌ No project or images found.");
            return;
        }
        if (loading || !hasMore) {
            console.log("🔴 Skipping loadMoreImages (loading:", loading, ", hasMore:", hasMore, ")");
            return;
        }
        setLoading(true);
        const pageSize = 10;
        const start = page * pageSize;
        const end = start + pageSize;
        console.log(`📌 Loading images from index ${start} to ${end}`);
        const newChunk = project.images.slice(start, end);
        if (newChunk.length === 0) {
            console.log("🚫 No more images to load.");
            setHasMore(false);
            setLoading(false);
            return;
        }
        console.log("🖼️ Adding images:", newChunk);
        setVisibleImages((prev) => [...prev, ...newChunk]);
        setPage((prev) => prev + 1);
        setLoading(false);
    }, [project, page, loading, hasMore]);

    useEffect(() => {
        if (project) {
            console.log("✅ Project loaded:", project.projectName);
            setHasMore(true);
            loadMoreImages();
        }
    }, [project]);

    useEffect(() => {
        if (project) {
            console.log("📌 Page changed, loading more images (page: ", page, ")");
            loadMoreImages();
        }
    }, [page]);

    const handleScroll = useCallback(() => {
        if (!hasMore || loading) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight - 200) {
            console.log("📌 Near bottom, loading next batch...");
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore, loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Download ZIP file, sending the token in the Authorization header.
    const handleDownloadZip = async () => {
        if (!projectId) return;
        const token =
            sessionStorage.getItem(`galleryToken_${projectId}`) ||
            sessionStorage.getItem("galleryAdminToken");
        try {
            const res = await fetch(`/api/downloadZip?projectId=${projectId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                console.error("❌ Failed to download zip:", res.statusText);
                return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `project-${projectId}-images.zip`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("❌ Error downloading zip:", error);
        }
    };

    // Modal event handlers.
    const handleImageClick = (src: string, alt: string) => {
        setModalImgSrc(src);
        setModalImgCaption(alt);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Header />

            <div className="gallery-container">
                {!project ? (
                    <p>⏳ Loading project data...</p>
                ) : (
                    <>
                        <div className="gallery-header-container">
                            <h2 className="gallery-header">
                                📸 Gallery: {project.projectName}
                            </h2>
                            <button className="download-button" onClick={handleDownloadZip}>
                                ⬇️ Download All as ZIP
                            </button>
                        </div>

                        <div className="row">
                            {[0, 1, 2, 3].map((colIndex) => (
                                <div className="column" key={colIndex}>
                                    {visibleImages
                                        .filter((_, idx) => idx % 4 === colIndex)
                                        .map((imgPath, idx) => {
                                            // For protected images, you might append the token as a query parameter.
                                            const token =
                                                sessionStorage.getItem(`galleryToken_${projectId}`) ||
                                                sessionStorage.getItem("galleryAdminToken");
                                            const imageUrl = `/api/image?image=galleries/${imgPath}&token=${token}`;
                                            const altText = `Project ${project.projectName} - ${imgPath}`;
                                            return (
                                                <img
                                                    key={idx}
                                                    src={imageUrl}
                                                    alt={altText}
                                                    className="gallery-image"
                                                    onClick={() => handleImageClick(imageUrl, altText)}
                                                />
                                            );
                                        })}
                                </div>
                            ))}
                        </div>

                        {loading && <p>⏳ Loading images...</p>}
                        {!hasMore && !loading && <p>🚫 No more images to load.</p>}
                    </>
                )}
            </div>

            {isModalOpen && (
                <div id="myModal" className="modal" onClick={handleModalClose}>
          <span className="close" onClick={handleModalClose}>
            &times;
          </span>
                    <img
                        className="modal-content"
                        src={modalImgSrc}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div id="caption">{modalImgCaption}</div>
                </div>
            )}
        </>
    );
};

export default GalleryPage;
