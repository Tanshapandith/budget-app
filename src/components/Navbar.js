import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaCog,
  FaTachometerAlt,
  FaList,
  FaExchangeAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const navigate = useNavigate(); 

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleSettingsMenu = () => setShowSettingsMenu(!showSettingsMenu);

  const handleLogout = () => {
    localStorage.removeItem("userId"); 
    navigate("/"); 
  };

  return (
    <div className="layout">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="left">
          <button className="menu-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1>💰 Expense Manager</h1>
        </div>

        <div className="settings-dropdown">
          <button className="settings-btn" onClick={toggleSettingsMenu}>
            <FaCog />
          </button>

          {showSettingsMenu && (
            <ul className="dropdown-menu">
              <li onClick={handleLogout}>
                <FaSignOutAlt className="icon" />
                Logout
              </li>
            </ul>
          )}
        </div>
      </header>

      {/* Side Navbar */}
      <aside className={`side-navbar ${isSidebarOpen ? "open" : ""}`}>
        <nav>
          <ul>
            <li>
              <NavLink to="/dashboard" activeClassName="active-link">
                <FaTachometerAlt className="icon" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" activeClassName="active-link">
                <FaList className="icon" />
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink to="/transactions" activeClassName="active-link">
                <FaExchangeAlt className="icon" />
                Transactions
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Navbar;
