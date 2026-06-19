import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const pageMeta = {
  '/': { title: 'Dashboard', breadcrumb: 'Overview & Analytics' },
  '/employees': { title: 'Employees', breadcrumb: 'Manage Employees' },
  '/employees/add': { title: 'Add Employee', breadcrumb: 'Create New Record' },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getPageMeta = () => {
    // Exact match first
    if (pageMeta[location.pathname]) {
      return pageMeta[location.pathname];
    }

    // Match edit route pattern /employees/edit/:id
    if (/^\/employees\/edit\//.test(location.pathname)) {
      return { title: 'Edit Employee', breadcrumb: 'Update Employee Record' };
    }

    // Match view route pattern /employees/:id
    if (/^\/employees\/[^/]+$/.test(location.pathname)) {
      return { title: 'Employee Details', breadcrumb: 'View Employee Profile' };
    }

    return { title: 'EMS', breadcrumb: 'Employee Management System' };
  };

  const { title, breadcrumb } = getPageMeta();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Page Title */}
      <div className="navbar-title">
        <h1 className="navbar-title-text">{title}</h1>
        <span className="navbar-title-breadcrumb">{breadcrumb}</span>
      </div>

      {/* Search Bar */}
      <div className="navbar-search">
        <svg
          className="navbar-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search employees, departments..."
          readOnly
        />
        <div className="navbar-search-shortcut">
          <kbd>Ctrl</kbd>
          <kbd>K</kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Theme Toggle */}
        <button
          className="navbar-theme-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Notification Bell */}
        <button className="navbar-notification-btn" title="Notifications">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="navbar-notification-dot" />
        </button>

        <span className="navbar-divider" />

        {/* User Profile */}
        <div className="navbar-profile">
          <div className="navbar-avatar">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name || 'Admin User'}</span>
            <span className="navbar-user-role">{user?.email || 'Administrator'}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button className="navbar-logout-btn" onClick={handleLogout} title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
