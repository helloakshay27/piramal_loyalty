import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SetupSidebar from '../../components/SetupSidebar'; // <-- new import
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function RootLayout() {
  const location = useLocation();
  const [selectedNav, setSelectedNav] = useState("home");

  // Determine if the current path includes "tiers"
  const noTier = location.pathname.includes('/tiers'); // Adjust this condition as needed

  // Dynamically import CSS based on selectedNav, but do not remove after switching
  // React.useEffect(() => {
  //   // Remove any previously injected dynamic style
  //   const prevLink = document.getElementById('dynamic-css');
  //   if (prevLink) {
  //     prevLink.parentNode.removeChild(prevLink);
  //   }

  //   // Create new link element for the selected CSS
  //   const link = document.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.id = 'dynamic-css';
  //   link.href = selectedNav === "setup"
  //     ? '/styles/mor.css'
  //     : '/styles/style.css';
  //   document.head.appendChild(link);

  //   // Cleanup on unmount or nav change
  //   return () => {
  //     const link = document.getElementById('dynamic-css');
  //     if (link && link.parentNode) {
  //       link.parentNode.removeChild(link);
  //     }
  //   };
  // }, [selectedNav]);

  return (
    <main className="h-100 w-100">
      <Header noTier={noTier} onNavChange={setSelectedNav} />
      <div className="main-content">
        <div>
          {selectedNav === "setup" ? <SetupSidebar /> : <Sidebar />}
        </div>
        <div className="website-content flex-grow-1">
          <Outlet />
          <footer className="footer">
            <Footer />
          </footer>
        </div>
      </div>
    </main>
  );
}
