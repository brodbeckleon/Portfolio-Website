import React from 'react';
import './Header.css';

interface HeaderProps {
    title: string;
    socials: { name: string; url: string }[];
    links: { name: string; url: string }[];
}

const Header: React.FC<HeaderProps> = ({ title, socials, links }) => {
    return (
        <header className="header">
            <div className="social-icons">
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
        </header>
    );
};

export default Header;
