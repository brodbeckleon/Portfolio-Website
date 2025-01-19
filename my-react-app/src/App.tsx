import { useState } from 'react'
import './App.css'
import Header from './Header'

function App() {
    const [activeSection, setActiveSection] = useState('middle')



    return (
        <>
            <Header title="Léon Brodbeck" />
            <div className={`container ${activeSection}`}>



                <div className="section left" onClick={() => setActiveSection('left')}>
                    <h2>IT Portfolio</h2>
                    {/* Add your IT portfolio content here */}
                </div>
                <div className="section middle" onClick={() => setActiveSection('middle')}>

                    <div className="about-me">
                        <img className="profile-picture" src="https://avatars.githubusercontent.com/u/36162427?v=4" alt="Léon" />
                        
                        <p>Hello, I'm <b>Léon</b></p>
                        <p>
                            A full stack developer and visual creator based in <b>Zurich, Switzerland.</b>
                            <br />
                            I execute IT and creative projects. 
                        </p>
                        <p>Let's grab a coffee & <b>get to work</b> ❗️</p>
                    </div>
                </div>
                <div className="section right" onClick={() => setActiveSection('right')}>
                    <h2>Photography Portfolio</h2>
                    {/* Add your photography portfolio content here */}
                </div>
            </div>
        </>

    )
}

export default App