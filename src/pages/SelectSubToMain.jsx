import React, { useState } from 'react';
import operativesData from '../data/operatives.json'; // Adjust path if necessary

const SelectSubToMain = () => {
  const [selectedSubOption, setSelectedSubOption] = useState('');
  const [mainOptions, setMainOptions] = useState([]);

  // Collect all sub-options into a single array with a reference to their parent operative
  const allSubOptions = operativesData.flatMap((operative) =>
    operative.subOptions.map((subOption) => ({
      ...subOption,
      parentId: operative.id,
      parentName: operative.name,
    }))
  );
  

  // Handle change in sub-options dropdown
  const handleSubOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSubOption(selectedValue);

    // Find the main option(s) that contain this sub-option
    const matchingMainOptions = operativesData.filter((operative) =>
      operative.subOptions.some((subOption) => subOption.value === selectedValue)
    );

    setMainOptions(matchingMainOptions);
  };

  return (
    <div>
      
      <label htmlFor="subOptions">Select Sub-Option:</label>
      <select id="subOptions" value={selectedSubOption} onChange={handleSubOptionChange}>
        <option value="">-- Select Sub-Option --</option>
        {allSubOptions.map((subOption) => (
          <option key={subOption.id} value={subOption.value}>
            {subOption.name}
          </option>
        ))}
      </select>

      <label htmlFor="mainOptions">Select Operative Type:</label>
      <select id="mainOptions" disabled={!mainOptions.length}>
        <option value="">-- Select Operative Type --</option>
        {mainOptions.map((mainOption) => (
          <option key={mainOption.id} value={mainOption.id}>
            {mainOption.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectSubToMain;
