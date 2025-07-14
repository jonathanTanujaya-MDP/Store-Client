import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import { Menu, X } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="layout-container">
            {/* Mobile Hamburger Menu Button */}
            {isMobile && (
                <button 
                    className="mobile-menu-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            {/* Mobile Overlay */}
            {isMobile && isMobileMenuOpen && (
                <div 
                    className="mobile-overlay"
                    onClick={closeMobileMenu}
                />
            )}

            <Sidebar 
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={closeMobileMenu}
                isMobile={isMobile}
            />
            <div className="layout-content-area">
                <main className="layout-main-content">
                    <div className="layout-inner-content">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;