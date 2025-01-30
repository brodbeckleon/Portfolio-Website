import './SectionAbout.css';

const SectionAbout = () => {
    return <>
        <div className="about-me">
            <img className="profile-picture" src="images/about-leon.png" alt="Léon" />
            <p>
                Hello, I'm <b>Léon</b>
            </p>
            <p>
                A full stack developer and visual creator based in <b>Zurich, Switzerland.</b>
                <br />
                I execute IT and creative projects.
            </p>
            <p>
                Let's grab a coffee & <b>get to work</b> ❗️
            </p>
        </div>
    </>
}

export default SectionAbout;