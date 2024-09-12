import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () =>{
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  }

  const [isBarangOpen, setBarangOpen] = useState(false);

  const toggleBarangDropdown = () => {
    setBarangOpen(!isBarangOpen);
  };

  return (
    <div id="sidebar" style={styles.sidebar}>
      <div className="sidebar-wrapper active" style={styles.sidebarWrapper}>
        <div className="sidebar-header position-relative" style={styles.sidebarHeader}>
          <div className="d-flex align-items-center">
            <div className="logo">
              <a href="#">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/020/983/339/original/dolly-flatbed-icon-design-free-vector.jpg"
                  alt="Logo"
                  style={styles.logo}
                />
              </a>
            </div>
            <div className="logo-text" style={styles.logoText}>
              Peminjaman Barang
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          <ul className="menu" style={styles.menu}>
            <li className="sidebar-title"></li>
            <li className="sidebar-item active" style={styles.sidebarItem}>
              <NavLink to="/dashboard" className="sidebar-link" style={styles.sidebarLink}>
                <i className="fa-solid fa-house" />
                <span style={styles.linkText}>Dashboard</span>
              </NavLink>
            </li>
            {user && user.role === "admin" && (
              <div>
                <li className="sidebar-item" style={styles.sidebarItem}>
                  <NavLink to="/user" className="sidebar-link" style={styles.sidebarLink}>
                    <i className="fa-solid fa-users" />
                    <span style={styles.linkText}>Data User</span>
                  </NavLink>
                </li>
              </div>
            )}
            {user && user.role === "admin" && (
              <div>
                <li className={`sidebar-item has-sub ${isBarangOpen ? 'open' : ''}`} style={styles.sidebarItem}>
                  <div className="sidebar-link" onClick={toggleBarangDropdown} style={styles.sidebarLink}>
                    <i className="fa-solid fa-briefcase" />
                    <span style={styles.linkText}>Data Barang</span>
                    <i className={`fa-solid fa-chevron-down ${isBarangOpen ? 'rotate' : ''}`} style={styles.chevronIcon}></i>
                  </div>
                  {isBarangOpen && (
                    <ul className="submenu" style={styles.submenu}>
                      <li className="submenu-item" style={styles.submenuItem}>
                        <NavLink to="/barang" className="submenu-link" style={styles.submenuLink}>
                          Komputer
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </div>
            )}
            {user && user.role === "admin" && (
              <div>
                <li className="sidebar-item" style={styles.sidebarItem}>
                  <NavLink to="/peminjamanAdmin" className="sidebar-link" style={styles.sidebarLink}>
                    <i className="fa-solid fa-laptop" />
                    <span style={styles.linkText}>Data Peminjaman</span>
                  </NavLink>
                </li>
              </div>
            )}
            {user && user.role === "admin" && (
              <div>
                <li className="sidebar-item" style={styles.sidebarItem}>
                  <NavLink to="/pengembalianAdmin" className="sidebar-link" style={styles.sidebarLink}>
                    <i className="fa-solid fa-laptop" />
                    <span style={styles.linkText}>Data Pengembalian</span>
                  </NavLink>
                </li>
              </div>
            )}
            {user && user.role === "user" && (
              <div>
                <li className="sidebar-item" style={styles.sidebarItem}>
                  <NavLink to="/peminjaman" className="sidebar-link" style={styles.sidebarLink}>
                    <i className="fa-solid fa-laptop" />
                    <span style={styles.linkText}>Data Peminjaman</span>
                  </NavLink>
                </li>
              </div>
            )}
            {user && user.role === "user" && (
              <div>
                <li className="sidebar-item" style={styles.sidebarItem}>
                  <NavLink to="/pengembalian" className="sidebar-link" style={styles.sidebarLink}>
                    <i className="fa-solid fa-laptop" />
                    <span style={styles.linkText}>Data Pengembalian</span>
                  </NavLink>
                </li>
              </div>
            )}
            <li className="sidebar-item" style={styles.sidebarItem}>
              <button onClick={logout} className="sidebar-link" style={{...styles.sidebarLink, 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  color: 'inherit', 
                  cursor: 'pointer'
                }}>
                <i className="fa-solid fa-right-from-bracket" />
                <span style={styles.linkText}>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    backgroundColor: '#fff',
    width: '250px',
    height: '100vh', 
    position: 'fixed', 
    top: 0,  
    left: 0,  
    zIndex: 100, 
    overflowY: 'auto',
  },
  sidebarWrapper: {
    padding: '0',
  },
  sidebarHeader: {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '1.5rem',
  },
  logo: {
    maxWidth: '40px',
    height: 'auto',
  },
  logoText: {
    marginLeft: '10px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#243561',
  },
  menu: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  sidebarItem: {
    padding: '15px 20px',
    transition: 'background 0.3s ease',
    marginBottom: '10px',
  },
  sidebarLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#000',
    textDecoration: 'none',
    width: '100%',
    fontSize: '17px',
  },
  linkText: {
    marginLeft: '10px',
  },
  submenu: {
    listStyle: 'none',
    padding: '10px 20px',
    margin: '0',
  },
  submenuItem: {
    padding: '10px 0',
    marginLeft: '20px',
  },
  submenuLink: {
    color: '#5469D4',
    textDecoration: 'none',
    fontSize: '16px',
  },
  chevronIcon: {
    marginLeft: 'auto',
    transition: 'transform 0.3s ease',
  },
};

export default Sidebar;