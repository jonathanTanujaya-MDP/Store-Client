import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, ShoppingCart, BarChart2, Bell, PlusCircle, RotateCcw, LogOut, User } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useUIScale } from '../context/UIScaleContext';
import { useAuth } from '../context/AuthContext.jsx';
import './Sidebar.css';

const Sidebar = ({ isMobileOpen = false, onMobileClose, isMobile = false }) => {
    const { lowStockCount } = useProducts();
    const { scaleFactor, setScaleFactor } = useUIScale();
    const { user, logout } = useAuth();

    const sidebarRef = useRef(null);
    const [sidebarWidth, setSidebarWidth] = useState(240);
    const [isResizing, setIsResizing] = useState(false);

    const handleZoomIn = () => {
        setScaleFactor(prev => Math.min(prev + 0.1, 1.5));
    };

    const handleZoomOut = () => {
        setScaleFactor(prev => Math.max(prev - 0.1, 0.8));
    };

    const startResizing = (e) => {
        if (!isMobile) { // Disable resizing on mobile
            setIsResizing(true);
        }
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (e) => {
        if (isResizing && !isMobile) {
            const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
            if (newWidth > 150 && newWidth < 350) {
                setSidebarWidth(newWidth);
            }
        }
    };

    const handleLogout = () => {
        logout();
        if (isMobile && onMobileClose) {
            onMobileClose(); // Close mobile menu
        }
    };

    const handleNavClick = () => {
        if (isMobile && onMobileClose) {
            onMobileClose(); // Close mobile menu when nav item is clicked
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
        return () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    return (
        <div 
            ref={sidebarRef} 
            className={`sidebar-container ${isMobile && isMobileOpen ? 'mobile-open' : ''}`}
            style={{ width: isMobile ? (isMobileOpen ? '200px' : '0px') : sidebarWidth }}
        >
            <div className="sidebar-header">
                <div className="app-title-container">
                    <h1>Manajemen Stock</h1>
                </div>
                {user && (
                    <div className="user-info">
                        <User size={16} />
                        <span>{user.username}</span>
                        <span className="user-role">({user.role})</span>
                    </div>
                )}
            </div>
            <nav className="sidebar-nav">
                <Link to="/" className="sidebar-nav-item" onClick={handleNavClick}>
                    <Home className="sidebar-icon" />
                    <span>Dashboard</span>
                </Link>
                <Link to="/products" className="sidebar-nav-item" onClick={handleNavClick}>
                    <Package className="sidebar-icon" />
                    <span>Products</span>
                </Link>
                <Link to="/history" className="sidebar-nav-item" onClick={handleNavClick}>
                    <ShoppingCart className="sidebar-icon" />
                    <span>History</span>
                </Link>
                <Link to="/add-transaction" className="sidebar-nav-item" onClick={handleNavClick}>
                    <PlusCircle className="sidebar-icon" />
                    <span>Add Transaction</span>
                </Link>
                <Link to="/restock" className="sidebar-nav-item" onClick={handleNavClick}>
                    <RotateCcw className="sidebar-icon" />
                    <span>Restock</span>
                </Link>
                <Link to="/reports" className="sidebar-nav-item" onClick={handleNavClick}>
                    <BarChart2 className="sidebar-icon" />
                    <span>Reports</span>
                </Link>
                <Link to="/stock-alerts" className="sidebar-nav-item" onClick={handleNavClick}>
                    <Bell className="sidebar-icon" />
                    <span>Stock Alerts {lowStockCount > 0 && <span className="notification-dot"></span>}</span>
                </Link>
                <div className="sidebar-divider"></div>
                <button onClick={handleLogout} className="sidebar-logout-btn">
                    <LogOut className="sidebar-icon" />
                    <span>Logout</span>
                </button>
                <div className="sidebar-zoom-controls">
                    <button onClick={handleZoomOut} className="zoom-button">-</button>
                    <span className="zoom-level">{(scaleFactor * 100).toFixed(0)}%</span>
                    <button onClick={handleZoomIn} className="zoom-button">+</button>
                </div>
            </nav>
            {!isMobile && (
                <div 
                    className="sidebar-resizer"
                    onMouseDown={startResizing}
                />
            )}
        </div>
    );
};

export default Sidebar;