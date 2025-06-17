import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/style.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("/"); // Set default active item

  const location = useLocation(); // Get the current location

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed); // Toggle collapse state
  };

  // Only set the active item if it is the first load
  useEffect(() => {
    // Only set the active item if it's the initial render
    if (activeItem === "/") {
      setActiveItem(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    const collapseElement = document.getElementById("userRoleCollapse");

    // Listen for Bootstrap collapse events
    collapseElement.addEventListener("show.bs.collapse", () =>
      setIsCollapsed(true)
    );
    collapseElement.addEventListener("hide.bs.collapse", () =>
      setIsCollapsed(false)
    );

    // Cleanup listeners on unmount
    return () => {
      collapseElement.removeEventListener("show.bs.collapse", () =>
        setIsCollapsed(true)
      );
      collapseElement.removeEventListener("hide.bs.collapse", () =>
        setIsCollapsed(false)
      );
    };
  }, []);

  // Function to close the sidebar
  const closeNav = () => {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) {
      sidebar.style.display = "none"; // Change to your desired closing behavior
    }
  };

  const handleNavLinkClick = (path) => {
    // Only update the active item if the clicked path is different from the current active item
    if (activeItem !== path) {
      setActiveItem(path);
    }
  };

  return (
    <div className="sidebar sidebar_inner" id="mySidebar">
      <p className="closebtn">
        <span className="material-symbols-outlined cancel" onClick={closeNav}>
          cancel
        </span>
      </p>
      <ul className="px-2 collapse left-1" style={{ display: "block" }} id="sidebarCollapse">
        <li className="nav-item">
          <NavLink
            to="/"
            className={`nav-link d-flex justify-content-between ${activeItem === "/" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/")}
          >
            <span className="text">Dashboard</span>
            
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/members"
            className={`nav-link d-flex justify-content-between ${activeItem === "/members" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/members")}
          >
            <span className="text">Members</span>
            
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/tiers"
            className={`nav-link d-flex justify-content-between ${activeItem === "/tiers" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/tiers")}
          >
            <span className="text">Tiers</span>
            
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/rule-engine"
            className={`nav-link d-flex justify-content-between ${activeItem === "/rule-engine" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/rule-engine")}
          >
            <span className="text">Rule Engine</span>
            
          </NavLink>
        </li>
        {/* Referral */}
        <li className="nav-item">
          <NavLink
            to="/referral-list"
            // className="menu-link d-flex gap-4"
            className={`nav-link d-flex justify-content-between ${activeItem === "/referral-list" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/referral-list")}
            data-section="security"
          >
            <span className="text">Referral</span>
            
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/enquiry-list"
            // className="menu-link d-flex gap-4"
            className={`nav-link d-flex justify-content-between ${activeItem === "/enquiry-list" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/enquiry-list")}
            data-section="security"
          >
            <span className="text">Enquiry List</span>
            
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/demand-notes"
            // className="menu-link d-flex gap-4"
            className={`nav-link d-flex justify-content-between ${activeItem === "/demand-notes" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/demand-notes")}
            data-section="security"
          >
            <span className="text">Demand Notes</span>
            
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/home-loan-request"
            // className="menu-link d-flex gap-4"
            className={`nav-link d-flex justify-content-between ${activeItem === "/home-loan-request" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/home-loan-request")}
            data-section="security"
          >
            <span className="text">Home Loan Request</span>
            
          </NavLink>
        </li>
        {/* <li className="nav-item">
          <a
            className="text nav-link d-flex justify-content-between"
            data-bs-toggle="collapse"
            data-bs-target="#userRoleCollapse"
          >
            <span className="text">Engage</span>
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-down-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-right-fill"
                viewBox="0 0 16 16"
              >
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>
            )}
          </a>
          <ul className="collapse p-0" id="userRoleCollapse">
            <li>
              <NavLink
                className={`ps-4 ${activeItem === "/Segment" ? "active" : ""}`}
                to="/Segment"
                onClick={() => handleNavLinkClick("/Segment")}
              >
                Segment
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`ps-4 ${activeItem === "/Campaign" ? "active" : ""}`}
                to="/Campaign"
                onClick={() => handleNavLinkClick("/Campaign")}
              >
                Campaign
              </NavLink>
            </li>
          </ul>
        </li> */}

<li className="nav-item">
      <a
        className="text nav-link d-flex justify-content-between"
        onClick={toggleCollapse} // Use React's state to handle collapse
        style={{ cursor: "pointer" }}
      >
        <span className="text">Engage</span>
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-down-fill"
            viewBox="0 0 16 16"
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
          </svg>
        )}
      </a>
      <ul className={`collapse p-0 ${isCollapsed ? "show" : ""}`} id="userRoleCollapse">
        <li>
          <NavLink
            className={`ps-4 ${activeItem === "/Segment" ? "active" : ""}`}
            to="/Segment"
            onClick={() => handleNavLinkClick("/Segment")}
          >
            Segment
          </NavLink>
        </li>
        <li>
          <NavLink
            className={`ps-4 ${activeItem === "/Campaign" ? "active" : ""}`}
            to="/Campaign"
            onClick={() => handleNavLinkClick("/Campaign")}
          >
            Campaign
          </NavLink>
        </li>
      </ul>
    </li>
        <li className="nav-item">
          <NavLink
            to="/test"
            className={`nav-link d-flex justify-content-between ${activeItem === "/services" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("/services")}
          >
            <span className="text">Reports</span>
            
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
