import React, { useState, useEffect } from "react";
import GophygitalLogo1 from "/GophygitalLogo1.svg";
import LockatedLogo from "/LockatedLogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import TypeHeader from "./TypeHeader";

const setupPaths = ["/event-list", "/admin-setup", "/event-create", "/event-edit"];

const Header = ({ noTier, onNavChange }) => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(() =>
    setupPaths.some((p) => location.pathname.startsWith(p)) ? "setup" : "home"
  );
  const hostname = window.location.hostname;

  useEffect(() => {
    const isSetup = setupPaths.some((p) => location.pathname.startsWith(p));
    setActiveNav(isSetup ? "setup" : "home");
  }, [location.pathname]);

  useEffect(() => {
    if (onNavChange) {
      onNavChange(activeNav);
    }
  }, [activeNav, onNavChange]);

  const clearModalState = () => {
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  const handleClose = () => {
    setShowModal(false);
    clearModalState();
  };

  const handleOpen = () => {
    setShowModal(true);
  };

  const signout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setShowModal(false);
    clearModalState();
    navigate("/login");
  };

  const userInitial =
    sessionStorage.getItem("firstname")?.[0]?.toUpperCase() || "A";

  return (
    <>
      <div
        className="modal"
        id="userInfo"
        aria-labelledby="userInfoLabel"
        aria-hidden={!showModal}
        role="dialog"
        style={{ display: showModal ? "block" : "none" }}
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
                <div className="avatar__letters2">{userInitial}</div>
              </div>
              <br />
              <h5 className="lockated-h2-medium">
                {sessionStorage.getItem("firstname") || "First Name"}
              </h5>
              <p className="lockated-body-4-regular text-muted">
                {sessionStorage.getItem("email") || "example@example.com"}
              </p>
              <button
                className="lockated-btn-primary btn my-3 px-4"
                aria-label="Close"
                onClick={signout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <header className="navbar navbar-expand-lg navbar-light lockated-header p-0">
        <div className="container-fluid">
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#lockatedHeaderNav"
            aria-controls="lockatedHeaderNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <img
            alt="logo"
            className="lockated-header__logo"
            src={
              hostname === "rustomjee-loyalty.lockated.com"
                ? LockatedLogo
                : GophygitalLogo1
            }
          />

          <div className="collapse navbar-collapse" id="lockatedHeaderNav">
            <ul className="lockated-header__nav navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className={`nav-link lockated-header__nav-link${
                    activeNav === "home" ? " is-active" : ""
                  }`}
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav("home");
                    navigate("/");
                  }}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link lockated-header__nav-link${
                    activeNav === "setup" ? " is-active" : ""
                  }`}
                  href="/event-list"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav("setup");
                    navigate("/event-list");
                  }}
                >
                  Setup
                </a>
              </li>
            </ul>
          </div>

          <div className="lockated-header__right">
            {!noTier && <TypeHeader />}
            <button
              type="button"
              className="lockated-header__icon-btn d-none d-md-inline-flex"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              type="button"
              className="lockated-header__avatar"
              aria-label="User menu"
              onClick={handleOpen}
              onKeyDown={(e) => e.key === "Enter" && handleOpen()}
            >
              <span className="avatar__letters">{userInitial}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
