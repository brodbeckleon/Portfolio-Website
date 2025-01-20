import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import SectionPhotography from './sections/SectionPhotography.tsx'
import SectionAbout from './sections/SectionAbout.tsx'

function App() {
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
            <Header title="Léon Brodbeck" />
            <div className={`container ${activeSection}`}>
                <div className="section left" onClick={() => setActiveSection('left')}>
                    <h2>IT Portfolio</h2>
                    {/* Add your IT portfolio content here */}
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