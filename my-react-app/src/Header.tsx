import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <div className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <img src="/path/to/instagram-icon.png" alt="Instagram" className="icon" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <img src="/path/to/youtube-icon.png" alt="YouTube" className="icon" />
        </a>
      </div>
      <h1 className="title">{title}</h1>
      <nav className="nav">
        <ul className="nav-list">
          <li><a href="/portfolio" className="nav-link">portfolio</a></li>
          <li><a href="/presets" className="nav-link">presets</a></li>
          <li><a href="/courses" className="nav-link">courses</a></li>
          <li><a href="/contact" className="nav-link">contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
