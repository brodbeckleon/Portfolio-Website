import { useEffect, useState } from "react";

const Gallery = () => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        fetch("/api/photos/project123", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setPhotos(data.photos));
    }, []);

    return (
        <div>
            <h2>Project Gallery</h2>
            {photos.map((photo, index) => (
                <img key={index} src={photo} alt="Client Photo" />
            ))}
        </div>
    );
};

export default Gallery;
