import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import Button from '../Button/Button';

const NavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand"><a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }} style={{textDecoration: 'none', color: 'Black'}}>Creche Tia Tata</a></div>
      <div className="hamburger" onClick={toggleMenu}>
        <span className={isOpen ? 'line line1 open' : 'line line1'}></span>
        <span className={isOpen ? 'line line2 open' : 'line line2'}></span>
        <span className={isOpen ? 'line line3 open' : 'line line3'}></span>
      </div>
      <ul className={isOpen ? 'navbar-links open' : 'navbar-links'}>
        <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }}>Início</a></li>
        <li><a href="/sobre" onClick={(e) => { e.preventDefault(); handleNavigate('/sobre'); }}>Sobre</a></li>
        <li><a href="/como-ajudar" onClick={(e) => { e.preventDefault(); handleNavigate('/como-ajudar'); }}>Como ajudar</a></li>
        <li><a href="/contato" onClick={(e) => { e.preventDefault(); handleNavigate('/contato'); }}>Contato</a></li>
        <li className="navbar-button"><Button onClick={() => handleNavigate('/quero-ajudar')} style={{ height: '40px', borderRadius: "8px", fontSize: "1.2rem" }}>Quero ajudar</Button></li>
      </ul>
    </nav>
  );
};

export default NavBar;