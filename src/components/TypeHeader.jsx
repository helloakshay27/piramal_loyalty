import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import BASE_URL from "../Confi/baseurl";

const TypeHeader = () => {
  const [selected, setSelected] = useState("Select an option");
  const [options, setOptions] = useState([]);
  const token = localStorage.getItem("access_token");

  // Fetch site options from API
  useEffect(() => {
    fetch(`${BASE_URL}loyalty/types.json?access_token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Once options are loaded, auto-select if only one option exists
  // or restore previously selected option from session storage
  useEffect(() => {
    if (options.length === 0) return;

    const savedName = sessionStorage.getItem("selectedName");
    const savedId = sessionStorage.getItem("selectedId");

    if (savedName && savedId) {
      // Restore previously selected option
      const storedOption = options.find((opt) => opt.id === parseInt(savedId));
      if (storedOption) {
        setSelected(storedOption.name);
        return;
      }
    }

    // Auto-select if there is only one option (e.g., Piramal)
    if (options.length === 1) {
      const onlyOption = options[0];
      setSelected(onlyOption.name);
      sessionStorage.setItem("selectedId", onlyOption.id);
      sessionStorage.setItem("selectedName", onlyOption.name);
    }
  }, [options]);

  const handleSelect = (eventKey, event) => {
    const selectedId = event.target.getAttribute("data-id"); // Get the ID
    const selectedName = event.target.getAttribute("data-name"); // Get the name

    console.log("Selected ID:", selectedId); // Debug selected ID
    console.log("Selected Name:", selectedName); // Debug selected name

    // Store the selected ID and name in session storage
    sessionStorage.setItem("selectedId", selectedId);
    sessionStorage.setItem("selectedName", selectedName);

    setSelected(eventKey); // Update the selected option

    // Refresh the page
    window.location.reload();
  };

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle
        id="dropdown-basic"
        style={{
          backgroundColor: "transparent",
          color: "black",
          border: "none",
        }}
      >
        {selected}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option) => (
          <Dropdown.Item
            key={option.id}
            eventKey={option.name}
            data-name={option.name}
            data-id={option.id} // Store the ID as a data attribute
          >
            {option.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TypeHeader;
