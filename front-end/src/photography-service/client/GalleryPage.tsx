import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

interface Project {
    id: number;
    projectName: string;
    images: string[];
}

const GalleryPage: React.FC = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [visibleImages, setVisibleImages] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProject = useCallback(async () => {
        if (!projectId) return;
        console.log("🟢 Fetching project:", projectId);

        try {
            const res = await fetch(`http://localhost:3000/api/fetchProject?projectId=${projectId}`);
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
            setPage(0);
            setVisibleImages([]);  // Reset images
            setHasMore(true);
            loadMoreImages();  // 🔥 Ensure first images are loaded
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
            setPage((prevPage) => prevPage + 1);  // Triggers useEffect([page])
        }
    }, [hasMore, loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleDownloadZip = async () => {
        if (!projectId) return;
        try {
            const res = await fetch(`http://localhost:3000/api/downloadZip?projectId=${projectId}`);
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

    const getRelativeImagePath = (absPath: string) => {
        console.log("🔍 Getting relative path for:", absPath);
        if (!absPath) return "";
        const idx = absPath.indexOf("galleries/");
        return idx !== -1 ? absPath.substring(idx) : absPath.split("/").pop() || absPath;
    };

    return (
        <div style={{ padding: '20px' }}>
            {!project ? (
                <p>⏳ Loading project data...</p>
            ) : (
                <>
                    <h2>📸 Gallery: {project.projectName}</h2>
                    <button onClick={handleDownloadZip}>⬇️ Download All as ZIP</button>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                        {visibleImages.length === 0 ? (
                            <p>🚫 No images available.</p>
                        ) : (
                            visibleImages.map((imgPath, idx) => {
                                const relativePath = getRelativeImagePath(imgPath);
                                console.log("🔍 Image path:", imgPath, "=>", relativePath);
                                const imageUrl = `/api/image?image=${relativePath}`;
                                return (
                                    <img
                                        key={idx}
                                        src={imageUrl}
                                        alt={`Project ${project.projectName} - ${idx}`}
                                        style={{ width: '250px', objectFit: 'cover' }}
                                    />
                                );
                            })
                        )}
                    </div>

                    {loading && <p>⏳ Loading images...</p>}
                    {!hasMore && !loading && <p>🚫 No more images to load.</p>}
                </>
            )}
        </div>
    );
};

export default GalleryPage;
