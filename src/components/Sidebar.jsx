import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/style.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [engageOpen, setEngageOpen] = useState(false);
  const domain = window.location.hostname;

  const linkClass = ({ isActive }) =>
    `nav-link lockated-sidebar__link${isActive ? " is-active" : ""}`;

  const subLinkClass = ({ isActive }) =>
    `lockated-sidebar__sublink${isActive ? " active" : ""}`;

  return (
    <aside
      className={`sidebar sidebar_inner lockated-sidebar${
        isCollapsed ? " is-collapsed" : ""
      }`}
      id="mySidebar"
    >
      <div className="lockated-sidebar__head">
        <span className="lockated-sidebar__label">Loyalty Menu</span>
        <button
          type="button"
          className="lockated-sidebar__collapse"
          onClick={() => setIsCollapsed((c) => !c)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      </div>

      <nav className="lockated-sidebar__nav">
        <ul className="left-1" style={{ display: "block" }}>
          <li className="nav-item">
            <NavLink
              to="/encash-list"
              className={linkClass}
              end
              title={isCollapsed ? "Encash" : undefined}
            >
              <span className="material-symbols-outlined">payments</span>
              <span className="menu-link-text">Encash</span>
            </NavLink>
          </li>

          {domain === "rustomjee-loyalty.lockated.com" && (
            <>
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link lockated-sidebar__link lockated-sidebar__group-toggle text-start"
                  title={isCollapsed ? "Engage" : undefined}
                  onClick={() => setEngageOpen((o) => !o)}
                  aria-expanded={engageOpen}
                >
                  <span className="material-symbols-outlined">campaign</span>
                  <span className="menu-link-text">Engage</span>
                  <span className="material-symbols-outlined lockated-sidebar__chevron">
                    {engageOpen ? "expand_more" : "chevron_right"}
                  </span>
                </button>
                {engageOpen && (
                  <ul className="list-unstyled mb-0">
                    <li>
                      <NavLink to="/Segment" className={subLinkClass}>
                        Segment
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/Campaign" className={subLinkClass}>
                        Campaign
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li className="nav-item">
                <NavLink
                  to="/test"
                  className={linkClass}
                  title={isCollapsed ? "Reports" : undefined}
                >
                  <span className="material-symbols-outlined">analytics</span>
                  <span className="menu-link-text">Reports</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
