import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdExplore, MdNotifications, MdMessage, MdPerson, MdSettings, MdLogout } from 'react-icons/md';
import { getUser,logout } from '../services/authService';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h1 className="sidebar-username">{`${user?.first_name.toUpperCase()}` + " " +`${user?.last_name.toUpperCase()}`}</h1>
      <ul className="sidebar-menu">
        <li><MdHome className="icon" /> Inicio</li>
        <li onClick={handleLogout} className="logout"><MdLogout className="icon" /> Cerrar sesión</li>
      </ul>
    </div>
  );
};

export default Sidebar;
