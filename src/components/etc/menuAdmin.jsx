import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { LOCAL_URL } from '../../Auth/config';

const NavbarAdmin = () => {
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
          <div className="brand-icon">👔</div>
          <span className="brand-text">KR<span className="text-primary">ESTUDIOS</span></span>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="nav-menu-desktop">
          <li><NavLink to="/" end className="nav-link-item">Dashboard</NavLink></li>
          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              Clientes <span className="arrow">▼</span>
            </NavLink>

            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/admin/nuevo-cliente"} className="submenu-link">Nuevo Cliente</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/admin/lista-clientes"} className="submenu-link">Lista Cliente</NavLink></li>
            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              Tramites <span className="arrow">▼</span>
            </NavLink>

            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/admin/nuevo-tramite"} className="submenu-link">Nuevo Trámite</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/admin/lista-tramites"} className="submenu-link">Lista Tramites</NavLink></li>
            </ul>
          </div>

          <li><NavLink to="/citas" className="nav-link-item">Ingresos</NavLink></li>
          <li><NavLink to="/reportes" className="nav-link-item">Salidas</NavLink></li>
          <li><NavLink to="/reportes" className="nav-link-item">Reportes</NavLink></li>

          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              CONF <span className="arrow">▼</span>
            </NavLink>

            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/admin/nuevo-usuario"} className="submenu-link">Nuevo Usuario</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/admin/lista-usuarios"} className="submenu-link">Lista Usuarios</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/admin/nuevo-tipo-tramite"} className="submenu-link">Nuevo Tipo Trámite</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/admin/lista-tipo-tramites"} className="submenu-link">Lista Tipo Tramites</NavLink></li>
            </ul>
          </div>


          <li className="nav-action">
            <NavLink to="/perfil" className="btn-nav-profile">Mi Perfil</NavLink>
            {/* <NavLink to="/perfil" className="mobile-link profile" style={{color:'#198754'}}>Mi Perfil</NavLink> */}

          </li>
        </ul>



        {window.innerWidth < 993 ? <>
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
            <NavLink to="#" end className="mobile-link">Dashboard</NavLink>

            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                Clientes <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/admin/nuevo-cliente"} className="submenu-link">Nuevo Cliente</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/admin/clientes"} className="submenu-link">Lista Clientes</NavLink></li>
              </ul>
            </div>
            <div className="nav-item-container has-submenu">

              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                Tramites <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/admin/nuevo-tramite"} className="submenu-link">Nuevo Trámite</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/admin/lista-tramites"} className="submenu-link">Lista Tramites</NavLink></li>
              </ul>
            </div>


            <NavLink to="/citas" className="mobile-link">Ingresos</NavLink>
            <NavLink to="/citas" className="mobile-link">Salidas</NavLink>
            <NavLink to="/citas" className="mobile-link">Reportes</NavLink>

            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                CONFIGURACIONES <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/admin/nuevo-usuario"} className="submenu-link">Nuevo Usuario</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/admin/lista-usuarios"} className="submenu-link">Lista Usuarios</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/admin/nuevo-tipo-tramite"} className="submenu-link">Nuevo Tipo Trámite</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/admin/lista-tipo-tramites"} className="submenu-link">Lista Tipo Tramites</NavLink></li>
              </ul>
            </div>


            <NavLink to="/perfil" className="mobile-link profile">Mi Perfil</NavLink>
          </div>
        </> : null}
      </div>


    </nav>
  );
};

export default NavbarAdmin;