import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../Pages/PageTitleContext';
import logoimg from '../images/GymFuel_logo_small (1).png';
import '../styles/sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt, faUsers, faUtensils, faListAlt, faDumbbell,
  faUser, faBars
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (title, path) => {
    setPageTitle(title);
    document.title = `GymFuel - ${title}`; // Update document title
    navigate(path);
    if (isMobile) setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: faTachometerAlt },
    { title: 'Customers', path: '/customers', icon: faUsers },
    { title: 'Nutrition', path: '/nutrition', icon: faUtensils },
    { title: 'Diet Category', path: '/dietcategory', icon: faListAlt },
    { title: 'Diet Plans', path: '/diet', icon: faDumbbell },
  ];

  // const accountItems = [
  //   { title: 'Profile', path: '/profile', icon: faUser },
  // ];

  return (
    <>
      {isMobile && (
        <button
          className="navbar-toggler position-fixed top-0 end-0 mt-3 me-3 z-index-1031 bg-white shadow-lg rounded-circle"
          type="button"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} className="text-dark fs-4" />
        </button>
      )}

      <aside
        className={`sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl fixed-start bg-gradient-darkblue shadow-lg ${isSidebarOpen ? 'show' : 'collapsed'}`}
        id="sidenav-main"
      >
        <div className="sidenav-header d-flex align-items-center justify-content-center ">
          <img src={logoimg} alt="GymFuel Logo" className="logo-image me-2" style={{
            width: '100px !important', height: '80px',
            transform: 'translateX(-10px)'
          }} />
          {isSidebarOpen &&
            <span
              className="font-weight-bold fs-4 text-white"
              style={{ transform: 'translateX(-10px)' }}
            >
              GymFuel
            </span>
          }
          
        </div>
        <hr className="horizontal light mt-0 mb-2" />

        <div className="sidebar-wrapper overflow-auto" style={{ height: 'calc(100vh - 180px)' }}>
          <ul className="navbar-nav">
            {menuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active bg-teal text-dark shadow-sm' : 'text-white'}`
                  }
                  to={item.path}
                  onClick={() => handleNavigation(item.title, item.path)}
                >
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={item.icon} className="me-3 fs-5" />
                    {isSidebarOpen && <span className="nav-link-text">{item.title}</span>}
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* <hr className="horizontal light mt-4 mb-2" />
          {isSidebarOpen && <h6 className="ps-4 text-uppercase text-xs text-white font-weight-bolder opacity-8 mb-1">Account Pages</h6>}

          <ul className="navbar-nav">
            {accountItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <NavLink
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active bg-teal text-dark shadow-sm' : 'text-white'}`
                  }
                  to={item.path}
                  onClick={() => handleNavigation(item.title, item.path)}
                >
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={item.icon} className="me-3 fs-5" />
                    {isSidebarOpen && <span className="nav-link-text">{item.title}</span>}
                  </div>
                </NavLink>
              </li>
            ))}
          </ul> */}
        </div>

        <div className="sidenav-footer position-absolute bottom-0 w-100 py-3">
          <div className="card card-plain text-center bg-transparent">
            <div className="card-body">
              <h6 className="text-white">{isSidebarOpen ? 'GymFuel' : ''}</h6>
              {isSidebarOpen && <p className="text-xs text-white mb-0">Copyright &copy; 2022 GymFuel. All rights reserved.</p>}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
