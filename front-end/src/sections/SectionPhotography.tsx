import { useState, useEffect } from 'react';
import './SectionPhotography.css';

const SectionPhotography = () => {
    const [slides, setSlides] = useState<string[]>([]);
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    useEffect(() => {
    // 1. Fetch the list of filenames from the server
    fetch('/api/slides?folder=photography-portfolio')
        .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching slides: ${response.statusText}`);
        }
        return response.json();
        })
        .then((data: string[]) => {
        setSlides(data);
        })
        .catch((error) => console.error('Error fetching slides:', error));
    }, []);

    const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (slides.length === 0) {
    return <p>Loading slides...</p>;
    }

    return (
    <div className="slideshow-container">

        {slides.map((slideSrc, index) => (
            <img
              key={index}
              src={`/api/image?image=photography-portfolio/${slideSrc}`}
              alt={`Slide ${index}`}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            />
        ))}

    <button className="prev" onClick={prevSlide}>
        &#10094; {/* left arrow */}
    </button>
    <button className="next" onClick={nextSlide}>
        &#10095; {/* right arrow */}
    </button>
    </div>
    );
};

export default SectionPhotography;
