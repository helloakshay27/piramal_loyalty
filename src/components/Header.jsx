import React, { useState, useEffect } from "react";
import GophygitalLogo1 from "/GophygitalLogo1.svg";
import { useNavigate, useLocation } from "react-router-dom";
import TypeHeader from "./TypeHeader";

const Header = ({ noTier, onNavChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeNav, setActiveNav] = useState("home"); // Track active nav
  const navigate = useNavigate();
  const location = useLocation();

  // Notify parent when activeNav changes
  useEffect(() => {
    if (onNavChange) {
      onNavChange(activeNav);
    }
  }, [activeNav, onNavChange]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleOpen = () => {
    setShowModal(true);
  };

  const signout = () => {
    console.log("Signing out...");
    sessionStorage.clear(); // Clear session storage
    localStorage.clear();

    setShowModal(false);

    // Remove any existing modal backdrop elements
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }

    navigate("/login");
  };

  return (
    <>
      <div
        className="modal"
        id="userInfo"
        aria-labelledby="userInfoLabel"
        aria-hidden={!showModal}
        role="dialog"
        style={{ display: showModal ? "block" : "none" }} // React controlled visibility
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              />
            </div>
            <div className="text-center pb-5">
              <div className="avatar2">
                <div className="avatar__letters2">A</div>
              </div>
              <br />
              <h5>{sessionStorage.getItem("firstname") || "First Name"}</h5>
              <p>{sessionStorage.getItem("email") || "example@example.com"}</p>
              <button
                className="purple-btn1 my-3"
                aria-label="Close"
                onClick={signout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light p-0">
        <div className="container-fluid py-1">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <img alt="logo" className="go-logo mx-3 my-2" src={GophygitalLogo1} />
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className={`nav-link${
                    activeNav === "home" ? " active rounded-2" : ""
                  }`}
                  href="./1CF_Main.html"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav("home");
                    navigate("/"); // or your actual home route
                  }}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link${
                    activeNav === "dashboard" ? " active rounded-2" : ""
                  }`}
                  href="./31Dashboard_Daily.html"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav("dashboard");
                    navigate("/dashboard"); // or your actual dashboard route
                  }}
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link${
                    activeNav === "setup" ? " active rounded-2" : ""
                  }`}
                  href="./31Dashboard_Daily.html"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav("setup");
                    navigate("/setup"); // or your actual setup route
                  }}
                >
                  Setup
                </a>
              </li>
            </ul>
            {!noTier && (
              <div className="top-nav-right">
                <div className="d-flex search-input w-50 mx-auto">
                  <span className="material-symbols-outlined">search</span>
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </div>
              </div>
            )}
          </div>
          <TypeHeader /> {/* Dropdown inside the header */}
          <div
            className="avatar"
            role="button"
            tabIndex="0"
            onClick={handleOpen} // Open the modal on click
            onKeyPress={(e) => e.key === "Enter" && handleOpen()} // Open on Enter key press
            data-bs-toggle="modal" // Optional if you want Bootstrap's behavior too
            data-bs-target="#userInfo"
          >
            <div className="avatar__letters">A</div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
