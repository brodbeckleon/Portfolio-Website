import React from 'react';
import './Header.css';

const title = "léon brodbeck";

const socials = [
    { name: 'Instagram', url: 'https://www.instagram.com/leon.brodbeck/' },
    { name: 'YouTube', url: 'https://www.youtube.com/@leon.brodbeck' },
    { name: 'GitHub', url: 'https://github.com/brodbeckleon' },
];

const links = [
    { name: 'portfolio', url: '/' },
    { name: 'presets', url: '/presets' },
    { name: 'courses', url: '/courses' },
    { name: 'contact', url: '/contact' },
];

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="socials">
                {socials.map((social, index) => (
                    <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <img
                            src={`/icons/icon-${social.name.toLowerCase()}.svg`}
                            alt={social.name}
                            className="icon"
                        />
                    </a>
                ))}
            </div>
            <div className={"title-wrapper"}>
                <a href="/" className="title-link">
                    <h1 className="title">{title}</h1>
                </a>
                <nav className="nav">
                    <ul className="nav-list">
                        {links.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} className="nav-link">
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className={"actions"}>
                <a href="/login" className="action-link">
                    Login
                </a>
            </div>
        </header>
    );
};

export default Header;