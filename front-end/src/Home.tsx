import { useState, useEffect } from 'react'
import './Home.css'
import Header from './components/Header'
import SectionPhotography from './sections/SectionPhotography.tsx'
import SectionAbout from './sections/SectionAbout.tsx'
import ThreeScene from "./three/ThreeScene.tsx";

function Home() {
    const [activeSection, setActiveSection] = useState('middle')

    useEffect(() => {
        if (activeSection === 'right') {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
    }, [activeSection])

    return (
        <>
            <Header/>

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

export default Home