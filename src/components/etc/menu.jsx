import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LOCAL_URL } from '../../Auth/config';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Efecto para cambiar el estilo al hacer scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => setIsMobileMenuOpen(false), [location]);

  return (
    <nav className={` nav-main ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <NavLink to="/" className="nav-brand">
          <div className="brand-icon">🏥</div>
          <span className="brand-text">MED<span className="text-primary">FLOW</span></span>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="nav-menu-desktop">
          <li><NavLink to="/" end className="nav-link-item">Dashboard</NavLink></li>
          <li><NavLink to="/pacientes" className="nav-link-item">Pacientes</NavLink></li>
          <li><NavLink to="/citas" className="nav-link-item">Agenda</NavLink></li>
          <li><NavLink to="/reportes" className="nav-link-item">Reportes</NavLink></li>
          <li className="nav-action">
            <NavLink to="/perfil" className="btn-nav-profile">Dr. Garcia</NavLink>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button 
          className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Mobile Overlay Menu */}
        <div className={`nav-menu-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
           <NavLink to="/" end className="mobile-link">Dashboard</NavLink>
           <NavLink to={LOCAL_URL+"/pacientes"} className="mobile-link">Pacientes</NavLink>
           <NavLink to="/citas" className="mobile-link">Agenda</NavLink>
           <NavLink to="/perfil" className="mobile-link profile">Mi Perfil</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;