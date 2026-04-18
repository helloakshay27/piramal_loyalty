import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventBackToListButton() {
  const navigate = useNavigate();

  return (
    <div className="mx-4 mt-2 mb-1 d-flex justify-content-start">
      <button
        type="button"
        className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-2 text-dark"
        onClick={() => navigate("/event-list")}
        aria-label="Back to event list"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
        <span className="small">Event list</span>
      </button>
    </div>
  );
}
