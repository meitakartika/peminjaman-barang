import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [role, setRole] = useState('User'); // Default role

  useEffect(() => {
    // Fungsi untuk mengambil data role
    const fetchRole = async () => {
      try {
        const response = await axios.get('http://localhost:5000/me'); 
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    fetchRole();
  }, []);

  // Menentukan teks berdasarkan role
  const getRoleText = () => {
    switch(role) {
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarLeft}></div>
      <div style={styles.navbarRight}>
        <div style={styles.userProfile}>
          <span style={styles.userName}>{getRoleText()}</span>
          <img 
            src="/avatar22.png"
            alt="User Avatar" 
            style={styles.avatar}
          />
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
    padding: '0 20px',
    height: '80px',
    position: 'fixed', 
    top: 0,
    left: '250px', 
    right: 0,
    zIndex: 1000, 
  },
  
  navbarLeft: {
    flex: 1,
  },
  
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
  },
  
  userProfile: {
    display: 'flex',
    alignItems: 'center',
  },
  
  userName: {
    marginRight: '10px',
    fontSize: '16px',
  },
  
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid #ddd',
    marginRight: '10px',
  }
};

export default Navbar;