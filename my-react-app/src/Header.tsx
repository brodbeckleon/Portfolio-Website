import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <div className="social-icons">
            <a href="https://www.instagram.com/leon.brodbeck/" target="_blank" rel="noopener noreferrer">
                <img src="/icons/icon-instagram.svg" alt="Instagram" className="icon" />
            </a>
            <a href="https://www.youtube.com/@leon.brodbeck" target="_blank" rel="noopener noreferrer">
                <img src="/icons/icon-youtube.svg" alt="YouTube" className="icon" />
            </a>
            <a href="https://github.com/brodbeckleon" target="_blank" rel="noopener noreferrer">
                <img src="/icons/icon-github.svg" alt="GitHub" className="icon" />
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
