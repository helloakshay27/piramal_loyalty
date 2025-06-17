import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import BASE_URL from "../Confi/baseurl";

const TypeHeader = () => {
  const [selected, setSelected] = useState("Select an option");
  const [options, setOptions] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch(`${BASE_URL}/loyalty/types.json?token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
      })
      .catch((error) => console.error("Error fetching data:", error));

    // Load previously selected option from session storage
    const storedId = sessionStorage.getItem("selectedId");
    if (storedId) {
      console.log("Stored ID from session:", storedId); // Debug stored ID
      const storedOption = options.find((opt) => opt.id === parseInt(storedId));
      if (storedOption) setSelected(storedOption.name);
    }
  }, []);

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

  useEffect(() => {
    // Retrieve the selected ID from session storage on component mount
    const savedId = sessionStorage.getItem("selectedName");
    if (savedId) {
      // Assuming you can derive eventKey from savedId
      setSelected(savedId); // Restore the selected option
    }
  }, []);
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
