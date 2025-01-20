import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import SectionPhotography from './sections/SectionPhotography.tsx'
import SectionAbout from './sections/SectionAbout.tsx'
import ThreeScene from "./three/ThreeScene.tsx";

function App() {
    const [activeSection, setActiveSection] = useState('middle')

    const socials = [
        { name: 'Instagram', url: 'https://www.instagram.com/leon.brodbeck/' },
        { name: 'YouTube', url: 'https://www.youtube.com/@leon.brodbeck' },
        { name: 'GitHub', url: 'https://github.com/brodbeckleon' },
    ];

    const links = [
        { name: 'portfolio', url: '/portfolio' },
        { name: 'presets', url: '/presets' },
        { name: 'courses', url: '/courses' },
        { name: 'contact', url: '/contact' },
    ];

    useEffect(() => {
        if (activeSection === 'right') {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
    }, [activeSection])

    return (
        <>
            <Header title="Léon Brodbeck" socials={socials} links={links} />
            <div className={`container ${activeSection}`}>
                <div className="section left" onClick={() => setActiveSection('left')}>
                    <h2>IT Portfolio</h2>
                    <ThreeScene />
                </div>
                <div className="section middle" onClick={() => setActiveSection('middle')}>
                    <SectionAbout />
                </div>
                <div className="section right" onClick={() => setActiveSection('right')}>
                    <SectionPhotography />
                </div>
            </div>
        </>
    )
}

export default App