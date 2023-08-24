// Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'; // Import the CSS file for sidebar styling

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
