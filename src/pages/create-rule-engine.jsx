import React, { useState, useEffect } from "react";
import SubHeader from "../components/SubHeader";
// @ts-ignore
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchMasterAttributes,
  fetchSubAttributes,
  fetchMasterRewardOutcomes,
  fetchSubRewardOutcomes,
} from "../Confi/ruleEngineApi";
import BASE_URL from "../Confi/baseurl";

import { masterOperators } from './operatorsData'; // Import your data

const CreateRuleEngine = () => {

  const navigate = useNavigate()
  const [conditions, setConditions] = useState([
    {
      id: 1,
      masterAttribute: "",
      subAttribute: "",
      masterOperator: "",
      subOperator: "",
      condition_type: "",
      value: '',
      master_operator: ''
    },
  ]);

  const token 
=localStorage.getItem("access_token")

  const [ruleName, setRuleName] = useState("");
  const [masterAttributes, setMasterAttributes] = useState([]);
  // @ts-ignore
  const [selectedMasterAttribute, setSelectedMasterAttribute] = useState("");
  const [subAttributes, setSubAttributes] = useState([]);

  const [masterRewardOutcomes, setMasterRewardOutcomes] = useState([]);
  const [selectedMasterRewardOutcomes, setSelectedMasterRewardOutcomes] = useState({ id: '', name: '' });
  const [subRewardOutcomes, setSubRewardOutcomes] = useState([]);
  const [subRewardOutcomesnew, setsubRewardOutcomesnew] = useState([]);


  // @ts-ignore
  const [selectedMasterOperator, setSelectedMasterOperator] = useState("");
  const [subOperators, setSubOperators] = useState([]);
  // @ts-ignore
  const [selectedSubOperator, setSelectedSubOperator] = useState("");

  const [error, setError] = useState("")
  const [parameter, setParameter] = useState('')
  const [previousValue, setPreviousValue] = useState('');


  // const handleMasterOperatorChange = (e) => {
  //   const selectedName = e.target.value; //handle master operator
  //   setSelectedMasterOperator(selectedId);

  //   const selectedMaster = masterOperators.find((op) => op.name === selectedName);
  //   setSubOperators(selectedMaster ? selectedMaster.subOptions : []);
  //   setSelectedSubOperator(""); // Reset sub operator selection
  // };

  const handleMasterOperatorChange = (e) => {
    const selectedName = e.target.value; // Handle master operator change
    setSelectedMasterOperator(selectedName); // Store selected master operator name

    // Find the selected master operator by its name
    const selectedMaster = masterOperators.find((op) => op.name === selectedName);

    // Set subOperators based on the selected master operator
    // @ts-ignore
    setSubOperators(selectedMaster ? selectedMaster.subOptions : []);
    
    // Reset the sub operator selection
    setSelectedSubOperator("");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const companyId = 44; // Set this according to your needs
        const activeStatus = true; // Set this according to your needs
        const masterAttrs = await fetchMasterAttributes(
          companyId,
          activeStatus
        );
        setMasterAttributes(masterAttrs.master_attributes || []);

        const rewardOutcomes = await fetchMasterRewardOutcomes(
          companyId,
          activeStatus
        );
        setMasterRewardOutcomes(rewardOutcomes.master_reward_outcome || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    getData();
  }, []);

  //selected master attribute
  const handleMasterAttributeChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedMasterAttribute(selectedId);

    // Find the index of the selected master attribute
    const selectedIndex = masterAttributes.findIndex(
      // @ts-ignore
      (attr) => attr.id === parseInt(selectedId)
    );
    console.log(selectedIndex);

    if (selectedIndex !== -1) {
      // Check if the index is valid
      try {
        const subAttrs = await fetchSubAttributes(selectedId);
        console.log(subAttrs.master_attributes[selectedIndex].sub_attributes);
        const selectedSubAttributes =
          subAttrs.master_attributes[selectedIndex].sub_attributes;
        setSubAttributes(selectedSubAttributes);
      } catch (error) {
        console.error("Error fetching sub attributes:", error);
      }
    } else {
      console.error("Selected ID not found in master attributes");
    }
  };

  //selected master reward outcome
  const handleMasterSubRewardOutcomeChange = async (e) => {
    const selectedId = e.target.value;

    const selectedOption = e.target.selectedOptions[0]; // Get the selected <option> element
    const selectedName = selectedOption.getAttribute('data-name'); // Get the data-name attribute    setSelectedMasterRewardOutcomes(selectedName);
    setSelectedMasterRewardOutcomes({
      id: selectedId,
      name: selectedName,
    });

    // Find the index of the selected master attribute
    const selectedIndex = masterRewardOutcomes.findIndex(
      // @ts-ignore
      (attr) => attr.id === parseInt(selectedId)
    );
    console.log(selectedIndex);

    if (selectedIndex !== -1) {
      // Check if the index is valid
      try {
        const subRewardOutcomes = await fetchSubRewardOutcomes(selectedId);
        console.log(
          subRewardOutcomes.master_reward_outcome[selectedIndex]
            .sub_reward_outcome
        );
        const selectedSubRewardOutcomes =
          subRewardOutcomes.master_reward_outcome[selectedIndex]
            .sub_reward_outcome;
        setSubRewardOutcomes(selectedSubRewardOutcomes);
      } catch (error) {
        console.error("Error fetching sub attributes:", error);
      }
    } else {
      console.error("Selected ID not found in master attributes");
    }
  };


  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: conditions.length + 1,
        masterAttribute: "",
        subAttribute: "",
        masterOperator: "",
        subOperator: "",
        condition_type: "",
        value: '',
        master_operator: ''
      },
    ]);
  };


  const handleSubmit = async () => {
    // Validate required fields
    // if (!ruleName || conditions.some(cond =>
    //   !cond.subAttribute ||
    //   !cond.subOperator ||
    //   !cond.value ||
    //   !cond.masterAttribute ||
    //   cond.value === previousValue // Check against previous value
    // )) {
    //   // setError("All fields are required.");
    //   toast.error("All Mandatory field are required", {
    //     position: "top-center",
    //     autoClose: 3000,
    //   });
    //   return;
    // }


    if (!ruleName) {
      toast.error("Rule Name is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }


    conditions.forEach((cond, index) => {
      setTimeout(() => {
        if (!cond.masterAttribute) {
          toast.error(`Condition ${index + 1}: Master Attribute is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (!cond.subAttribute) {
          toast.error(`Condition ${index + 1}: Sub Attribute is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (!cond.master_operator) {
          toast.error(`Condition ${index + 1}: Master Operator is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (!cond.subOperator) {
          toast.error(`Condition ${index + 1}: Sub Operator is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (!cond.value) {
          toast.error(`Condition ${index + 1}: Value is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }, index * 3500); // Add a delay of 3500ms between each toast
    });


    //  / / Validate Master Reward Outcome
    // if (!selectedMasterRewardOutcomes.name) {
    //   toast.error("Master Reward Outcome is required.", {
    //     position: "top-center",
    //     autoClose: 3000,
    //   });
    //   return;
    // }
    setTimeout(() => {
      if (!selectedMasterRewardOutcomes.name) {
        toast.error("Master Reward Outcome is required.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }, conditions.length * 3500); // Delay based on the number of conditions

    // Validate Sub Reward Outcome
    // if (!subRewardOutcomesnew.id) {
    //   toast.error("Sub Reward Outcome is required.", {
    //     position: "top-center",
    //     autoClose: 3000,
    //   });
    //   return;
    // }


    const isInvalid = conditions.some(
      (cond) =>
        !cond.masterAttribute ||
        !cond.subAttribute ||
        !cond.master_operator ||
        !cond.subOperator ||
        !cond.value ||
        cond.value === previousValue
    );

    if (isInvalid) {
      return;
    }

    // Proceed with form submission or further logic



    // Check for duplicate condition values and ensure they are numbers
    const values = conditions.map(cond => cond.value);
    const uniqueValues = new Set();
    for (const value of values) {
      if (value.trim() === "") {
        // setError(" Please enter value.");
        return;
      }
      uniqueValues.add(value);
    }

    // @ts-ignore
    if (isNaN(parameter) || parameter.trim() === "") {
      setError("Parameter value must be a valid number.");
      return;
    }

    if (uniqueValues.size !== values.length) {
      setError("Each condition value must be unique.");
      return;
    }

    // Update previousValue to the current value before proceeding
    const newValue = conditions.map(cond => cond.value);
    // @ts-ignore
    setPreviousValue(newValue); // Store the latest value(s) as the previous value]

    // const storedValue = sessionStorage.getItem("selectedId")

    const data = {
      rule_engine_rule: {
        name: ruleName, // Ensure ruleName is defined elsewhere in your code
        description: "This is a description of the sample rule.",
        loyalty_type_id: sessionStorage.getItem("selectedId"),//type id
        // Mapping conditions dynamically
        rule_engine_conditions_attributes: conditions.map((condition) => ({
          condition_attribute: condition.subAttribute || "", // Handle blank cases if needed
          operator: condition.subOperator || "",
          compare_value: condition.value || "",
          condition_selected_model: Number(condition.masterAttribute) || 1,
          condition_type: condition.condition_type || "",
          master_operator: condition.master_operator || ""
        })),

        rule_engine_actions_attributes: [{
          lock_model_name: selectedMasterRewardOutcomes.name || "",
          parameters: [Number(parameter) || ""],
          rule_engine_available_function_id: subRewardOutcomesnew || "",
          action_selected_model: Number(selectedMasterRewardOutcomes.id) || "",
        }
        ]
      }
    }


    console.log("Request Payload:", JSON.stringify(data, null, 2)); // Log the JSON payload for debugging

    try {
      // @ts-ignore
      if (ruleName !== "" && parameter !== "" && selectedMasterRewardOutcomes !== "" && conditions !== null) {
        const response = await fetch(
          `${BASE_URL}/rule_engine/rules/loyalty_re?token=${token}`,
          {
            method: "POST", // Specify the request method
            headers: {
              "Content-Type": "application/json", // Set content type to JSON
            },
            body: JSON.stringify(data), // Convert the data to JSON
          }
        );

        if (response.ok) {
          const responseData = await response.json(); // Parse the JSON response
          // alert("Rule Engine created successfully!");
          navigate("/rule-engine")
          console.log("Data created successfully:", responseData);
          // clearInputs(); // Clear form inputs if needed
        } else {
          const errorData = await response.json(); // Parse error response
          setError(`Failed to create Rule Engine: ${errorData.message}`);
          console.error("Submission error:", errorData);
        }
      }
    } catch (error) {
      setError("Failed to create Rule Engine. Please try again.");
      console.error("Submission error:", error);
    }
  };

  //cross button
  const removeCondition = (id) => {
    const updatedConditions = conditions.filter(condition => condition.id !== id);
    setConditions(updatedConditions);
  };



  const renderCondition = (condition, index) => (
    <div key={condition.id} className="SetRuleCard">
      <div>
        <h6 className="mt-3">
          <span style={{ fontSize: '18px', fontWeight: '600' }}>Condition {condition.id}
            {index > 0 && ( // Only show the button for conditions after the first one
              <button
                onClick={() => removeCondition(condition.id)}
                className="ms-3"
                // title="Remove Condition"
                style={{ border: 'none', backgroundColor: 'white' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x"
                  viewBox="0 0 16 16"
                >
                  <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 1 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 1 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            )}
          </span>
        </h6>
      </div>
      {index > 0 && ( // Only render the AND/OR section if this is not the first condition
        <ul className="nav nav-tabs border-0 mt-3">
          <div className="d-flex gap-3 And-btn rounded">
            <li className="nav-item d-flex p-2 gap-2" role="presentation">
              <input
                type="radio"
                className="nav-link"
                id={`home-tab-${index}`}
                name={`tab-${index}`}
                data-bs-toggle="tab"
                data-bs-target={`#home-tab-pane-${index}`}
                role="tab"
                aria-controls={`home-tab-pane-${index}`}
                aria-selected="true"
                defaultChecked
                // @ts-ignore
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, condition_type: "AND" }
                      : cond
                  );
                  setConditions(updatedConditions);

                }}
                checked={condition.condition_type === "AND"}
              />
              <label htmlFor={`home-tab-${index}`} className="and-or-btn">
                AND
              </label>
            </li>
            <li className="nav-item d-flex p-2 gap-2" role="presentation">
              <input
                type="radio"
                className="nav-link"
                id={`profile-tab-${index}`}
                name={`tab-${index}`}
                data-bs-toggle="tab"
                data-bs-target={`#profile-tab-pane-${index}`}
                role="tab"
                aria-controls={`profile-tab-pane-${index}`}
                aria-selected="false"
                // @ts-ignore
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, condition_type: "OR" }
                      : cond
                  );
                  setConditions(updatedConditions);

                }}
                checked={condition.condition_type === "OR"}
              />
              <label htmlFor={`profile-tab-${index}`} className="and-or-btn">
                OR
              </label>
            </li>
          </div>
        </ul>
      )}

      <div className="border-btm pb-2 mt-2">
        {/* ......if ..... */}
        <div>
          <h4>
            <span className="badge setRuleCard" style={{ fontSize: '16px', fontWeight: '600', color: '#E95420', backgroundColor: '#E954202E' }}>IF</span>
          </h4>
          <div className="row ms-1 mt-2">
            {/* Attribute section */}
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                Master Attribute<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1  mt-1 mb-1"
                style={{ fontSize: '12px', fontWeight: '400' }}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, masterAttribute: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                  handleMasterAttributeChange(e); // If needed to fetch sub attributes
                }}
                value={condition.masterAttribute}

              >
                <option value="">Select Master Attribute </option>
                {masterAttributes.map((attr) => (
                  <option key={attr.
// @ts-ignore
                  id} value={attr.id}>
                    {attr.
// @ts-ignore
                    display_name}
                  </option>
                ))}
              </select>
            </fieldset>
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <h4>&</h4>
            </div>
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                Sub Attribute<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1  mt-1 mb-1"
                style={{ fontSize: '12px', fontWeight: '400' }}
                disabled={!condition.masterAttribute}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, subAttribute: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                }}
                value={condition.subAttribute}
              >
                <option value="">Select Sub Attribute</option>
                {subAttributes.map((subAttr) => (
                  <option key={subAttr.
// @ts-ignore
                  id} value={subAttr.attribute_name}>
                    {subAttr.
// @ts-ignore
                    display_name}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>
        </div>

        {/* Operator section */}
        <div className="mt-3">
          <h4>
            <span className="badge setRuleCard" style={{ fontSize: '16px', fontWeight: '600', color: '#E95420', backgroundColor: '#E954202E' }}>Operator</span>
          </h4>
          <div className="row ms-1 mt-2">
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                Master Operator<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1 mt-1 mb-1"
                style={{ fontSize: '12px', fontWeight: '400' }}
                value={condition.master_operator}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, master_operator: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                  handleMasterOperatorChange(e); // If needed to update sub operators
                }}
              >
                <option value="">Select Master Operator </option>
                {masterOperators.map((op) => (
                  <option key={op.id} value={op.name}>
                    {op.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <h4>&</h4>
            </div>
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                Sub Operator<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1  mt-1 mb-1"
                style={{ fontSize: '12px', fontWeight: '400' }}
                disabled={!condition.master_operator}
                value={condition.subOperator}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, subOperator: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                }}
              >
                <option value="">Select Sub Operator </option>
                {subOperators.map((subOp) => (
                  <option key={subOp.
// @ts-ignore
                  id} value={subOp.value}>
                    {subOp.
// @ts-ignore
                    name}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>
        </div>

        {/* Value section */}
        <div className="mt-3">
          <h4>
            <span className="badge setRuleCard" style={{ fontSize: '16px', fontWeight: '600', color: '#E95420', backgroundColor: '#E954202E' }}>Value</span>
          </h4>
          <div className="row ms-1 mt-2">
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                Value<span>*</span>
              </legend>
              <input
                type="text"
                className="p-1 mt-1 mb-1"
                style={{ fontSize: '12px', fontWeight: '400' }}
                placeholder="Enter Point Value"
                value={condition.value}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, value: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                }}
              />
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-100">
        {/* <SubHeader /> */}
        <div className="module-data-section mt-2">
          <p className="pointer">
            <Link to='/rule-engine' >
              <span>Rule Engine</span>
            </Link>{" "}
            &gt; New Rule
          </p>
          <h5 className="mb-3">
            <span className="title" style={{ fontSize: '20px', fontWeight: '600' }}>New Rule</span>
          </h5>
          <div className="go-shadow me-3">
            <div className="row ms-1">
              <fieldset className="border col-md-11 m-2 col-sm-11">
                <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                  New Rule<span>*</span>
                </legend>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="mt-1 mb-1"
                  style={{ fontSize: '12px', fontWeight: '400' }}
                />
              </fieldset>
            </div>
          </div>

          <div className="main-rule">
            {conditions.map(renderCondition)}

            <button
              className="setRuleCard2 mt-2"
              onClick={addCondition}
              style={{ color: "black", fontSize: '16px', fontWeight: "500" }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
              </span>
              Add Additional Condition
            </button>

            {/* THEN section */}
            <div className="mt-3">
              <h4>
                <span className="badge setRuleCard" style={{ fontSize: '16px', fontWeight: '600', color: '#E95420', backgroundColor: '#E954202E' }}>THEN</span>
              </h4>
              <div className="row ms-1 mt-2">
                <fieldset className="border  col-md-3 m-2 col-sm-11">
                  <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                    Master Reward Outcome<span>*</span>
                  </legend>
                  <select
                    // @ts-ignore
                    required=""
                    className="p-1 mt-1 mb-1"
                    style={{ fontSize: '12px', fontWeight: '400' }}
                    onChange={handleMasterSubRewardOutcomeChange}
                    value={selectedMasterRewardOutcomes.id || ""} // Use the id directly from state
                  >
                    <option value="" disabled>Select Master Reward Outcome</option>
                    {masterRewardOutcomes.map((reward) => (
                      <option key={reward.
// @ts-ignore
                      id} value={reward.id} data-name={reward.lock_model_name}>
                        {reward.
// @ts-ignore
                        display_name}
                      </option>
                    ))}
                  </select>

                </fieldset>
                <div className="col-md-1 d-flex justify-content-center align-items-center">
                  <h4>&</h4>
                </div>
                <fieldset className="border  col-md-3 m-2 col-sm-11">
                  <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                    Sub Reward Outcome<span>*</span>
                  </legend>
                  <select
                    // @ts-ignore
                    required=""
                    className="p-1 mt-1 mb-1"
                    style={{ fontSize: '12px', fontWeight: '400' }}
                    disabled={!selectedMasterRewardOutcomes}
                    onChange={(e) => {
                      const selectedId = e.target.value; // Get the selected sub-reward outcome ID
                      console.log(selectedId)
                      // Handle the selection as needed, e.g., update the state or construct the data object
                      // @ts-ignore
                      setsubRewardOutcomesnew(selectedId);
                    }}
                    value={subRewardOutcomesnew} // Ensure this reflects the selected sub-reward outcome
                  >
                    <option value="">Select Sub Reward Outcome</option>

                    {subRewardOutcomes.map((reward) => (
                      <option
                        // @ts-ignore
                        key={reward.id}
                        // value={reward.rule_engine_available_model_id}
                        // @ts-ignore
                        value={reward.id}
                      >
                        {reward.
// @ts-ignore
                        display_name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {/* <div className="col-md-1 d-flex justify-content-center align-items-center">
                    <h4>=</h4>
                  </div> */}
                <fieldset className="border col-md-3 m-2 col-sm-11 ">
                  <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                    Parameter {/* <span>*</span> */}
                  </legend>
                  <input type="text" placeholder="Enter Parameter Value" value={parameter} onChange={(e) => setParameter(e.target.value)} className="mt-1 mb-1" style={{ fontSize: '12px', fontWeight: '400' }} />
                </fieldset>
              </div>
            </div>
          </div>

          {error && <div className="error" style={{ color: 'red' }}>{error}</div>}

          {/* ..... */}
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button className="purple-btn1 w-100" onClick={handleSubmit}>Submit</button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn2 w-100" onClick={() => {
                setRuleName('')
                setConditions((prevConditions) =>
                  prevConditions.map((condition) => ({
                    ...condition,
                    masterAttribute: "",
                    subAttribute: "",
                    masterOperator: "",
                    subOperator: "",
                    condition_type: "",
                    value: "",
                  }))
                );
                setSelectedMasterRewardOutcomes({ id: '', name: '' })
                setSubRewardOutcomes([])
                setParameter('')
              }}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateRuleEngine;