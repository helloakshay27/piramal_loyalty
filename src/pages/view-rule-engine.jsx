import React, { useEffect, useState } from "react";
import SubHeader from "../components/SubHeader";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
// @ts-ignore
import {
  fetchMasterRewardOutcomes,
  fetchSubRewardOutcomes,
} from "../Confi/ruleEngineApi";
import BASE_URL from "../Confi/baseurl";

const ViewRuleEngine = () => {
  const { id } = useParams(); // Get the member ID from the URL
  // const [ruleName, setRuleName] = useState("");
  const token = localStorage.getItem("access_token");

  const [rule, setRule] = useState({
    name: "",
    conditions: [],
    actions: [],
  });
  console.log(id);

  //transform
  const formatFieldName = (fieldName) => {
    if (!fieldName) {
      // Return an empty string or a default value if fieldName is invalid
      return "";
    }
    return fieldName
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/::/g, " ") // Replace :: with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  };

  const [conditions, setConditions] = useState([
    {
      id: 1,
      masterAttribute: "",
      subAttribute: "",
      masterOperator: "",
      subOperator: "",
      condition_type: "",
      value: "",
    },
  ]);

  const [actions, setactions] = useState([
    {
      fetchMasterRewardOutcome: "",
      fetchSubRewardOutcome: "",
      parameters: "",
    },
  ]);

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
        value: "",
      },
    ]);
  };

  // const removeCondition = (id) => {
  //   const updatedConditions = conditions.filter(condition => condition.id !== id);
  //   setConditions(updatedConditions);
  // };

  const renderCondition = (condition, index) => (
    <div key={condition.id} className="SetRuleCard">
      <div>
        <h6 className="mt-3">
          <span>
            Condition {condition.id}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-square mb-1 ms-3 text-body-secondary"
              viewBox="0 0 16 16"
            >
              {/* <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" /> */}
              {/* <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              /> */}
            </svg>
            {/* <button
              onClick={() => removeCondition(condition.id)}
              className="ms-3"
              style={{ border: "none", backgroundColor: "white" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 1 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 1 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button> */}
          </span>
        </h6>
      </div>

      {/* {index > 0 && (
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
                value={condition.action_type}
                checked={condition.action_type=== "AND"}
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
                value={condition.action_type}
                checked={condition.action_type? condition.action_type==="OR": ''}
              />
              <label htmlFor={`profile-tab-${index}`} className="and-or-btn">
                OR
              </label>
            </li>
          </div>
        </ul>
      )} */}

      {/* {index > 0 && condition && (
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
                value={condition.action_type}
                // checked={condition.action_type === "AND"}
                readOnly
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
                value={condition.action_type}
                // checked={condition.action_type === "OR"}
                readOnly
              />
              <label htmlFor={`profile-tab-${index}`} className="and-or-btn">
                OR
              </label>
            </li>
          </div>
        </ul>
      )} */}

      {console.log("condition:", condition)}

      {index > 0 && condition && (
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
                value="AND" // Explicit value for "AND"
                checked={condition.condition_type === "AND"} // Maps to condition.action_type from API
                readOnly // Prevent user changes if required
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
                value="OR" // Explicit value for "OR"
                checked={condition.condition_type === "OR"} // Maps to condition.action_type from API
                readOnly // Prevent user changes if required
              />
              <label htmlFor={`profile-tab-${index}`} className="and-or-btn">
                OR
              </label>
            </li>
          </div>
        </ul>
      )}

      <div className="border-btm pb-2 mt-2">
        {/* If section */}
        <div>
          <h4>
            <span
              className="badge setRuleCard"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#E95420",
                backgroundColor: "#E954202E",
              }}
            >
              IF
            </span>
          </h4>
          <div className="row ms-1 mt-2">
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Master Attribute<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1 mt-1 mb-1"
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  appearance: "none",
                }}
                disabled
              >
                <option value="">{condition.model_name}</option>
              </select>
            </fieldset>
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <h4>&</h4>
            </div>
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Sub Attribute<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1 mt-1 mb-1"
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  appearance: "none",
                }}
                disabled
              >
                <option value="">
                  {formatFieldName(condition.condition_attribute)}
                </option>
              </select>
            </fieldset>
          </div>
        </div>

        {/* Operator Section */}
        <div className="mt-3">
          <h4>
            <span
              className="badge setRuleCard"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#E95420",
                backgroundColor: "#E954202E",
              }}
            >
              Operator
            </span>
          </h4>
          <div className="row ms-1 mt-2">
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Master Operator<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1 mt-1 mb-1"
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  appearance: "none",
                }}
                disabled
              >
                <option value="">{condition.master_operator}</option>
              </select>
            </fieldset>
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <h4>&</h4>
            </div>
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Sub Operator<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1 mt-1 mb-1"
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  appearance: "none",
                }}
                disabled
              >
                <option value="">{formatFieldName(condition.operator)}</option>
              </select>
            </fieldset>
          </div>
        </div>

        {/* Value section */}
        <div className="mt-3">
          <h4>
            <span
              className="badge setRuleCard"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#E95420",
                backgroundColor: "#E954202E",
              }}
            >
              Value
            </span>
          </h4>
          <div className="row ms-1 mt-2">
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Value<span>*</span>
              </legend>
              <input
                type="text"
                className="p-1 mt-1 mb-1"
                value={condition.compare_value}
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  // height: "40px", // Set consistent height for the value box
                }}
                // readOnly
                disabled
              />
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );

  // const storedValue = sessionStorage.getItem("selectedId");
  const getRuleEngine = async (id) => {
    // console.log("Stored ID in session after selection:", storedValue, id);
    const storedValue = sessionStorage.getItem("selectedId");
    try {
      const response = await axios.get(
        `${BASE_URL}/rule_engine/rules/${id}.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );
      console.log("data for id", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching Rule Engine:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const data = await getRuleEngine(id);
        console.log(data);
        setRule(data);
        if (data.conditions) {
          console.log(data.conditions);
          setConditions(data.conditions);
        }
        if (data.actions) {
          console.log(data.actions);
          setactions(data.actions);
        }
      } catch (err) {
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchRule();
  }, [id]);

  return (
    <>
      <div className="w-100">
        {/* <SubHeader /> */}
        <div className="module-data-section mt-2">
          <p className="pointer">
            <Link to="/rule-engine">
              <span>Rule Engine</span>
            </Link>
            &gt; View Rule
          </p>
          <h5 className="mb-3">
            <span
              className="title"
              style={{ fontSize: "20px", fontWeight: "600" }}
            >
              View Rule
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              fill="currentColor"
              className="bi bi-pencil-square mb-2 ms-3 text-body-secondary"
              viewBox="0 0 16 16"
            >
              {/* <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              /> */}
            </svg>
          </h5>
          <div className="go-shadow me-3">
            <div className="row ms-1">
              <fieldset className="border col-md-11 m-2 col-sm-11">
                <legend
                  className="float-none"
                  style={{ fontSize: "14px", fontWeight: "400" }}
                >
                  New Rule<span>*</span>
                </legend>
                <input
                  type="text"
                  disabled
                  placeholder="Enter Name"
                  name={rule?.name}
                  value={rule.name}
                  style={{ fontSize: "12px", fontWeight: "400" }}
                  className="mt-1 mb-1"
                />
              </fieldset>
            </div>
          </div>
          <div className="SetRuleCard">
            <div>
              <h5 className="title mt-3">Set Rule Conditions</h5>
            </div>
          </div>

          <div className="main-rule">
            {conditions.map(renderCondition)}

            <button
              className="setRuleCard2 mt-2"
              onClick={addCondition}
              style={{ color: "black", fontSize: "16px", fontWeight: "500" }}
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
                <span
                  className="badge setRuleCard"
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#E95420",
                    backgroundColor: "#E954202E",
                  }}
                >
                  THEN
                </span>
              </h4>
              <div className="row ms-1 mt-2">
                <fieldset className="border  col-md-3 m-2 col-sm-11">
                  <legend
                    className="float-none"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Master Reward Outcome<span>*</span>
                  </legend>

                  <select
                    // @ts-ignore
                    required=""
                    className="p-1 mt-1 mb-1"
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      appearance: "none",
                    }}
                    disabled
                  >
                    {actions.map((master) => (
                      <option value="">
                        {formatFieldName(master.lock_model_name)}
                      </option>
                    ))}
                    {/* // <option value="">Select Master Reward Outcome</option> */}
                    {/* // <option value=""></option> */}
                  </select>
                </fieldset>
                <div className="col-md-1 d-flex justify-content-center align-items-center">
                  <h4>&</h4>
                </div>
                <fieldset className="border  col-md-3 m-2 col-sm-11">
                  <legend
                    className="float-none"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Sub Reward Outcome<span>*</span>
                  </legend>
                  <select
                    // @ts-ignore
                    required=""
                    className="p-1 mt-1 mb-1"
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      appearance: "none",
                    }}
                    disabled
                  >
                    {actions.map((master) => (
                      <option value="">
                        {formatFieldName(master.action_method)}
                      </option>
                    ))}
                    {/* <option value="">Select Sub Reward Outcome</option>

                    <option value=""></option> */}
                  </select>
                </fieldset>
                {/* <div className="col-md-1 d-flex justify-content-center align-items-center">
                    <h4>=</h4>
                  </div> */}
                <fieldset className="border col-md-3 m-2 col-sm-11 ">
                  <legend
                    className="float-none"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Parameter {/* <span>*</span> */}
                  </legend>
                  {actions.map((master) => (
                    <input
                      type="text"
                      placeholder="Enter Point Value"
                      value={master.parameters}
                      style={{ fontSize: "12px", fontWeight: "400" }}
                      className="mt-1 mb-1"
                      disabled
                    />
                  ))}
                  {/* <input type="text" placeholder="Enter Point Value" value={} /> */}
                </fieldset>
              </div>
            </div>
          </div>

          {/* <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button className="purple-btn1 w-100" fdprocessedid="u33pye">
                Save for Approval
              </button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
                Cancel
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ViewRuleEngine;

//another

// import React, { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";
// import SubHeader from "../components/SubHeader";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchMasterAttributes,
//   fetchSubAttributes,
//   fetchMasterRewardOutcomes,
//   fetchSubRewardOutcomes,
// } from "../Confi/ruleEngineApi";

// const CreateRuleEngine = () => {

//   const navigate = useNavigate()
//   const [conditions, setConditions] = useState([
//     {
//       id: 1,
//       masterAttribute: "",
//       subAttribute: "",
//       masterOperator: "",
//       subOperator: "",
//       condition_type: "",
//       value: ''
//     },
//   ]);

//   const [actions, setActions] = useState([
//     { parameter: "", selectedMasterRewardOutcomes: "" }
//   ]);

//   const [ruleName, setRuleName] = useState("");
//   const [masterAttributes, setMasterAttributes] = useState([]);
//   const [selectedMasterAttribute, setSelectedMasterAttribute] = useState("");
//   const [subAttributes, setSubAttributes] = useState([]);

//   const [masterRewardOutcomes, setMasterRewardOutcomes] = useState([]);
//   const [selectedMasterRewardOutcomes, setSelectedMasterRewardOutcomes] = useState("");
//   const [subRewardOutcomes, setSubRewardOutcomes] = useState([]);

//   const [selectedMasterOperator, setSelectedMasterOperator] = useState("");
//   const [subOperators, setSubOperators] = useState([]);
//   const [selectedSubOperator, setSelectedSubOperator] = useState("");

//   const [error, setError] = useState("")
//   const [parameter, setParameter] = useState('')
//   const [previousValue, setPreviousValue] = useState('');

//   //operator data static
//   const masterOperators = [
//     {
//       id: "0",
//       name: "Common Operatives",
//       subOptions: [
//         { id: "1", name: "greater_than", value: "greater_than" },
//         { id: "2", name: "Less than (<)", value: "less_than" },
//         { id: "3", name: "Equals (=)", value: "equals" },
//         { id: "4", name: "Not equals (!=)", value: "not_equals" },
//         { id: "5", name: "Contains", value: "" },
//         { id: "6", name: "Does not contain", value: "" },
//       ],
//     },
//     {
//       id: "1",
//       name: "Logical Operatives",
//       subOptions: [
//         { id: "1", name: "AND", value: "" },
//         { id: "2", name: "OR", value: "" },
//         { id: "3", name: "NOT", value: "" },
//       ],
//     },
//     {
//       id: "2",
//       name: "Date/Time Operatives",
//       subOptions: [
//         { id: "1", name: "Before", value: "" },
//         { id: "2", name: "After", value: "" },
//         { id: "3", name: "Between", value: "" },
//         { id: "4", name: "Within", value: "" },
//       ],
//     },
//     {
//       id: "3",
//       name: "Tier Operatives",
//       subOptions: [
//         { id: "1", name: "Is in tier", value: "" },
//         { id: "2", name: "Upgrade", value: "" },
//         { id: "3", name: "Downgrade", value: "" },
//       ],
//     },
//   ];

//   const handleMasterOperatorChange = (e) => {
//     const selectedId = e.target.value; //handle master operator
//     setSelectedMasterOperator(selectedId);

//     const selectedMaster = masterOperators.find((op) => op.id === selectedId);
//     setSubOperators(selectedMaster ? selectedMaster.subOptions : []);
//     setSelectedSubOperator(""); // Reset sub operator selection
//   };

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const companyId = 44; // Set this according to your needs
//         const activeStatus = true; // Set this according to your needs
//         const masterAttrs = await fetchMasterAttributes(
//           companyId,
//           activeStatus
//         );
//         setMasterAttributes(masterAttrs.master_attributes);

//         const rewardOutcomes = await fetchMasterRewardOutcomes(
//           companyId,
//           activeStatus
//         );
//         setMasterRewardOutcomes(rewardOutcomes.master_reward_outcome);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       }
//     };

//     getData();
//   }, []);

//   //selected master attribute
//   const handleMasterAttributeChange = async (e) => {
//     const selectedId = e.target.value;
//     setSelectedMasterAttribute(selectedId);

//     // Find the index of the selected master attribute
//     const selectedIndex = masterAttributes.findIndex(
//       (attr) => attr.id === parseInt(selectedId)
//     );
//     console.log(selectedIndex);

//     if (selectedIndex !== -1) {
//       // Check if the index is valid
//       try {
//         const subAttrs = await fetchSubAttributes(selectedId);
//         console.log(subAttrs.master_attributes[selectedIndex].sub_attributes);
//         const selectedSubAttributes =
//           subAttrs.master_attributes[selectedIndex].sub_attributes;
//         setSubAttributes(selectedSubAttributes);
//       } catch (error) {
//         console.error("Error fetching sub attributes:", error);
//       }
//     } else {
//       console.error("Selected ID not found in master attributes");
//     }
//   };

//   //selected master reward outcome
//   const handleMasterSubRewardOutcomeChange = async (e) => {
//     const selectedId = e.target.value;
//     setSelectedMasterRewardOutcomes(selectedId);

//     // Find the index of the selected master attribute
//     const selectedIndex = masterRewardOutcomes.findIndex(
//       (attr) => attr.id === parseInt(selectedId)
//     );
//     console.log(selectedIndex);

//     if (selectedIndex !== -1) {
//       // Check if the index is valid
//       try {
//         const subRewardOutcomes = await fetchSubRewardOutcomes(selectedId);
//         console.log(
//           subRewardOutcomes.master_reward_outcome[selectedIndex]
//             .sub_reward_outcome
//         );
//         const selectedSubRewardOutcomes =
//           subRewardOutcomes.master_reward_outcome[selectedIndex]
//             .sub_reward_outcome;
//         setSubRewardOutcomes(selectedSubRewardOutcomes);
//       } catch (error) {
//         console.error("Error fetching sub attributes:", error);
//       }
//     } else {
//       console.error("Selected ID not found in master attributes");
//     }
//   };

//   const addCondition = () => {
//     setConditions([
//       ...conditions,
//       {
//         id: conditions.length + 1,
//         masterAttribute: "",
//         subAttribute: "",
//         masterOperator: "",
//         subOperator: "",
//         condition_type: "",
//         value: ''
//       },
//     ]);
//   };

//   // ------------------------------
//   // const data = {
//   //   rule_engine_rule: {
//   //     name: ruleName, // Use ruleName directly from state
//   //     description: "This is a description of the sample rule.",
//   //     rule_engine_conditions_attributes: conditions.map((condition) => ({
//   //       condition_attribute: condition.subAttribute,
//   //       operator: condition.subOperator,
//   //       compare_value: condition.value,
//   //       condition_selected_model: Number(condition.masterAttribute),
//   //       condition_type: condition.condition_type,
//   //     })),
//   //     rule_engine_actions_attributes: [
//   //       {
//   //         parameters: [Number(parameter)], // Assuming parameter is from state
//   //         action_selected_model: Number(selectedMasterRewardOutcomes), // Use state variable directly
//   //       },
//   //     ],
//   //   },
//   // };

//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!ruleName || conditions.some(cond =>
//       !cond.subAttribute ||
//       !cond.subOperator ||
//       !cond.value ||
//       !cond.masterAttribute ||
//       cond.value === previousValue // Check against previous value
//     )) {
//       setError("All fields are required.");
//       return;
//     }

//     // Check for duplicate condition values and ensure they are numbers
//     const values = conditions.map(cond => cond.value);
//     const uniqueValues = new Set();
//     for (const value of values) {
//       if (isNaN(value) || value.trim() === "") {
//         setError("Each condition value must be a valid number.");
//         return;
//       }
//       uniqueValues.add(value);
//     }

//     if (isNaN(parameter) || parameter.trim() === "") {
//       setError("Parameter value must be a valid number.");
//       return;
//     }

//     if (uniqueValues.size !== values.length) {
//       setError("Each condition value must be unique.");
//       return;
//     }

//     // Update previousValue to the current value before proceeding
//     const newValue = conditions.map(cond => cond.value);
//     setPreviousValue(newValue); // Store the latest value(s) as the previous value

//     const data = {
//       rule_engine_rule: {
//         name: ruleName, // Ensure ruleName is defined elsewhere in your code
//         description: "This is a description of the sample rule.",

//         // Mapping conditions dynamically
//         rule_engine_conditions_attributes: conditions.map((condition) => ({
//           condition_attribute: condition.subAttribute || "", // Handle blank cases if needed
//           operator: condition.subOperator || "",
//           compare_value: condition.value || "",
//           condition_selected_model: Number(condition.masterAttribute) || 1,
//           condition_type: condition.condition_type || "",
//         })),

//         // Mapping actions dynamically, handling blank fields
//         rule_engine_actions_attributes: actions.map((action) => ({
//           lock_model_name: action.lock_model_name || "", // Post as blank if not filled
//           parameters: [Number(action.parameter) || 0], // Ensure parameter is a number
//           rule_engine_available_function_id: action.rule_engine_available_function_id || "", // Blank if missing
//           action_selected_model: Number(action.selectedMasterRewardOutcomes) || 1,
//         })),
//       },
//     };

//     console.log("Request Payload:", JSON.stringify(data, null, 2)); // Log the JSON payload for debugging

//     try {
//       if (ruleName !== "" && parameter !== "" && selectedMasterRewardOutcomes !== "" && actions !== null && conditions !== null) {
//         const response = await fetch(
//           "https://staging.lockated.com/rule_engine/rules/loyalty_re?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
//           {
//             method: "POST", // Specify the request method
//             headers: {
//               "Content-Type": "application/json", // Set content type to JSON
//             },
//             body: JSON.stringify(data), // Convert the data to JSON
//           }
//         );

//         if (response.ok) {
//           const responseData = await response.json(); // Parse the JSON response
//           alert("Rule Engine created successfully!");
//           navigate("/rule-engine")
//           console.log("Data created successfully:", responseData);
//           clearInputs(); // Clear form inputs if needed
//         } else {
//           const errorData = await response.json(); // Parse error response
//           setError(`Failed to create Rule Engine: ${errorData.message}`);
//           console.error("Submission error:", errorData);
//         }
//       }
//     } catch (error) {
//       setError("Failed to create Rule Engine. Please try again.");
//       console.error("Submission error:", error);
//     }
//   };

//   const renderCondition = (condition, index) => (
//     <div key={condition.id} className="SetRuleCard">
//       <div>
//         <h6 className="mt-3">
//           <span>Condition {condition.id}</span>
//         </h6>
//       </div>
//       {index > 0 && ( // Only render the AND/OR section if this is not the first condition
//         <ul className="nav nav-tabs border-0 mt-3">
//           <div className="d-flex gap-3 And-btn rounded">
//             <li className="nav-item d-flex p-2 gap-2" role="presentation">
//               <input
//                 type="radio"
//                 className="nav-link"
//                 id={`home-tab-${index}`}
//                 name={`tab-${index}`}
//                 data-bs-toggle="tab"
//                 data-bs-target={`#home-tab-pane-${index}`}
//                 role="tab"
//                 aria-controls={`home-tab-pane-${index}`}
//                 aria-selected="true"
//                 defaultChecked
//                 onChange={(e) => {
//                   const updatedConditions = conditions.map((cond, idx) =>
//                     idx === index
//                       ? { ...cond, condition_type: "AND" }
//                       : cond
//                   );
//                   setConditions(updatedConditions);

//                 }}
//                 checked={condition.condition_type === "AND"}
//               />
//               <label htmlFor={`home-tab-${index}`} className="and-or-btn">
//                 AND
//               </label>
//             </li>
//             <li className="nav-item d-flex p-2 gap-2" role="presentation">
//               <input
//                 type="radio"
//                 className="nav-link"
//                 id={`profile-tab-${index}`}
//                 name={`tab-${index}`}
//                 data-bs-toggle="tab"
//                 data-bs-target={`#profile-tab-pane-${index}`}
//                 role="tab"
//                 aria-controls={`profile-tab-pane-${index}`}
//                 aria-selected="false"
//                 onChange={(e) => {
//                   const updatedConditions = conditions.map((cond, idx) =>
//                     idx === index
//                       ? { ...cond, condition_type: "OR" }
//                       : cond
//                   );
//                   setConditions(updatedConditions);

//                 }}
//                 checked={condition.condition_type === "OR"}
//               />
//               <label htmlFor={`profile-tab-${index}`} className="and-or-btn">
//                 OR
//               </label>
//             </li>
//           </div>
//         </ul>
//       )}

//       <div className="border-btm pb-2 mt-2">
//         {/* ......if ..... */}
//         <div>
//           <h4>
//             <span className="badge setRuleCard">IF</span>
//           </h4>
//           <div className="row ms-1 mt-2">
//             {/* Attribute section */}
//             <fieldset className="border col-md-3 m-2 col-sm-11">
//               <legend className="float-none">
//                 Master Attribute<span>*</span>
//               </legend>
//               <select
//                 required=""
//                 className="p-1"

//                 onChange={(e) => {
//                   const updatedConditions = conditions.map((cond, idx) =>
//                     idx === index
//                       ? { ...cond, masterAttribute: e.target.value }
//                       : cond
//                   );
//                   setConditions(updatedConditions);
//                   handleMasterAttributeChange(e); // If needed to fetch sub attributes
//                 }}
//                 value={condition.masterAttribute}

//               >
//                 <option value="">Select Master Attribute </option>
//                 {masterAttributes.map((attr) => (
//                   <option key={attr.id} value={attr.id}>
//                     {attr.display_name}
//                   </option>
//                 ))}
//               </select>
//             </fieldset>
//             <div className="col-md-1 d-flex justify-content-center align-items-center">
//               <h4>&</h4>
//             </div>
//             <fieldset className="border col-md-3 m-2 col-sm-11">
//               <legend className="float-none">
//                 Sub Attribute<span>*</span>
//               </legend>
//               <select
//                 required
//                 className="p-1"
//                 disabled={!condition.masterAttribute}
//                 onChange={(e) => {
//                   const updatedConditions = conditions.map((cond, idx) =>
//                     idx === index
//                       ? { ...cond, subAttribute: e.target.value }
//                       : cond
//                   );
//                   setConditions(updatedConditions);
//                 }}
//                 value={condition.subAttribute}
//               >
//                 <option value="">Select Sub Attribute</option>
//                 {subAttributes.map((subAttr) => (
//                   <option key={subAttr.id} value={subAttr.attribute_name}>
//                     {subAttr.display_name}
//                   </option>
//                 ))}
//               </select>
//             </fieldset>
//           </div>
//         </div>

//         {/* Operator section */}
//         <div className="mt-3">
//           <h4>
//             <span className="badge setRuleCard">Operator</span>
//           </h4>
//           <div className="row ms-1 mt-2">
//             <fieldset className="border col-md-3 m-2 col-sm-11">
//               <legend className="float-none">
//                 Master Operator<span>*</span>
//               </legend>
//               <select
//                 required=""
//                 className="p-1"
//                 value={condition.masterOperator}
//                 onChange={(e) => {
//                   const updatedConditions = conditions.map((cond, idx) =>
//                     idx === index
//                       ? { ...cond, masterOperator: e.target.value }
//                       : cond
//                   );
//                   setConditions(updatedConditions);
//                   handleMasterOperatorChange(e); // If needed to update sub operators
//                 }}
//               >
//                 <option value="">Select Master Operator </option>
//                 {masterOperators.map((op) => (
//                   <option key={op.id} value={op.id}>
//                     {op.name}
//                   </option>
//                 ))}
//               </select>
//             </fieldset>
//             <div className="col-md-1 d-flex justify-content-center align-items-center">
//               <h4>&</h4>
//             </div>
//             <fieldset className="border col-md-3 m-2 col-sm-11">
//               <legend className="float-none">
//                 Sub Operator<span>*</span>
//               </legend>
//               <select
//                 required
//                 className="p-1"
//                 disabled={!condition.masterOperator}
//                 value={condition.subOperator}
//                 onChange={(e) => {
//                   const updatedConditions = conditions.map((cond, idx) =>
//                     idx === index
//                       ? { ...cond, subOperator: e.target.value }
//                       : cond
//                   );
//                   setConditions(updatedConditions);
//                 }}
//               >
//                 <option value="">Select Sub Operator </option>
//                 {subOperators.map((subOp) => (
//                   <option key={subOp.id} value={subOp.value}>
//                     {subOp.name}
//                   </option>
//                 ))}
//               </select>
//             </fieldset>
//           </div>
//         </div>

//         {/* Value section */}
//         <div className="mt-3">
//           <h4>
//             <span className="badge setRuleCard">Value</span>
//           </h4>
//           <div className="row ms-1 mt-2">
//             <fieldset className="border col-md-3 m-2 col-sm-11">
//               <legend className="float-none">
//                 Value<span>*</span>
//               </legend>
//               <input
//                 type="text"
//                 className="p-1"
//                 placeholder="Enter Point Value"
//                 value={condition.value}
//                 onChange={(e) => {
//                   const updatedConditions = conditions.map((cond, idx) =>
//                     idx === index
//                       ? { ...cond, value: e.target.value }
//                       : cond
//                   );
//                   setConditions(updatedConditions);
//                 }}
//               />
//             </fieldset>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <div className="w-100">
//         <SubHeader />
//         <div className="module-data-section mt-2">
//           <p className="pointer">
//             <span className="text-secondary">Rule Engine</span> &gt; New Rule
//           </p>
//           <h5 className="mb-3">
//             <span className="title">New Rule</span>
//           </h5>
//           <div className="go-shadow me-3">
//             <div className="row ms-1">
//               <fieldset className="border col-md-11 m-2 col-sm-11">
//                 <legend className="float-none">
//                   New Rule<span>*</span>
//                 </legend>
//                 <input
//                   type="text"
//                   placeholder="Enter Name"
//                   value={ruleName}
//                   onChange={(e) => setRuleName(e.target.value)}
//                 />
//               </fieldset>
//             </div>
//           </div>

//           <div className="main-rule">
//             {conditions.map(renderCondition)}

//             <button
//               className="setRuleCard2 mt-2"
//               onClick={addCondition}
//               style={{ color: "black" }}
//             >
//               <span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="18"
//                   height="18"
//                   fill="currentColor"
//                   className="bi bi-plus"
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
//                 </svg>
//               </span>
//               Add Additional Condition
//             </button>

//             {/* THEN section */}
//             <div className="mt-3">
//               <h4>
//                 <span className="badge setRuleCard">THEN</span>
//               </h4>
//               <div className="row ms-1 mt-2">
//                 <fieldset className="border  col-md-3 m-2 col-sm-11">
//                   <legend className="float-none">
//                     Master Reward Outcome<span>*</span>
//                   </legend>
//                   <select
//                     required=""
//                     className="p-1"
//                     onChange={handleMasterSubRewardOutcomeChange}
//                     value={selectedMasterRewardOutcomes}
//                   >
//                     <option value="" selected="">
//                       Select Master Reward Outcome
//                     </option>
//                     {masterRewardOutcomes.map((reward) => (
//                       <option key={reward.id} value={reward.id}>
//                         {reward.display_name}
//                       </option>
//                     ))}
//                   </select>
//                 </fieldset>
//                 <div className="col-md-1 d-flex justify-content-center align-items-center">
//                   <h4>&</h4>
//                 </div>
//                 <fieldset className="border  col-md-3 m-2 col-sm-11">
//                   <legend className="float-none">
//                     Sub Reward Outcome<span>*</span>
//                   </legend>
//                   <select
//                     required=""
//                     className="p-1"
//                     disabled={!selectedMasterRewardOutcomes}
//                   >
//                     <option value="">Select Sub Reward Outcome</option>

//                     {subRewardOutcomes.map((reward) => (
//                       <option
//                         key={reward.id}
//                         value={reward.id}
//                       >
//                         {reward.display_name}
//                       </option>
//                     ))}
//                   </select>
//                 </fieldset>
//                 {/* <div className="col-md-1 d-flex justify-content-center align-items-center">
//                     <h4>=</h4>
//                   </div> */}
//                 <fieldset className="border col-md-3 m-2 col-sm-11 ">
//                   <legend className="float-none">
//                     Parameter {/* <span>*</span> */}
//                   </legend>
//                   <input type="text" placeholder="Enter Point Value" value={parameter} onChange={(e) => setParameter(e.target.value)} />
//                 </fieldset>
//               </div>
//             </div>
//           </div>

//           {error && <div className="error" style={{ color: 'red' }}>{error}</div>}

//           {/* ..... */}
//           <div className="row mt-2 justify-content-center">
//             <div className="col-md-2">
//               <button className="purple-btn1 w-100" onClick={handleSubmit}>Submit</button>
//             </div>
//             <div className="col-md-2">
//               <button className="purple-btn2 w-100">Cancel</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateRuleEngine;
