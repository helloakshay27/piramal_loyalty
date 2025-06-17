import React, { useState } from "react";

export default function RoundedRadioButtonCard({ onChange }) {
  const [selected, setSelected] = useState(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [circleHovered, setCircleHovered] = React.useState(false);

  const options = [
    {
      value: "lifetime",
      label: "Lifetime",
      description: "Lifetime points will help members advance to higher tiers.",
    },
    {
      value: "yearly",
      label: "Rolling Year",
      description:
        "Tier upgrades by earned points from current month to pretending month the following year.",
    },
  ];

  const handleClick = (value) => {
    setSelected(value);
    onChange(value); // Call onChange with the selected value
    console.log("selected :-----", value); // Log the selected value
  };

  return (
    <div style={{ paddingLeft: "10px" }}>
      {options.map((option) => (
        <div
          className="card m-4 tier-setting-card"
          style={{
            backgroundColor: isHovered ? "#fcd9d3" : "#fdeee9", // Hover effect for card
            transition: "background-color 0.3s ease",
          }}
          key={option.value}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="card-body">
            <div className="d-flex flex-column align-items-start">
              <div
                onClick={() => handleClick(option.value)}
                className="d-flex align-items-center m-2"
                style={{
                  cursor: "pointer",
                }}
                onMouseEnter={() => setCircleHovered(true)}
                onMouseLeave={() => setCircleHovered(false)}
              >
                <svg width="30" height="30">
                  <circle
                    cx="15"
                    cy="15"
                    r="10"
                    fill="none"
                    stroke={circleHovered ? "#ff5733" : "#e95420"} // Hover effect for circle
                    strokeWidth="2"
                    style={{
                      transition: "stroke 0.3s ease",
                    }}
                  />
                  {selected === option.value && (
                    <circle cx="15" cy="15" r="7" fill="#e95420" />
                  )}
                </svg>
                <h5 className="card-title mb-0 ps-3 fw-bold">{option.label}</h5>
              </div>
              <p className="text-muted ms-3" style={{ fontSize: "16px" }}>
                {option.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
