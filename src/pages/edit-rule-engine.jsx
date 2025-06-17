import React, { useState, useEffect } from "react";
import SubHeader from "../components/SubHeader";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchMasterAttributes,
  fetchSubAttributes,
  fetchMasterRewardOutcomes,
  fetchSubRewardOutcomes,
} from "../Confi/ruleEngineApi";

import { masterOperators } from "./operatorsData"; // Import your data
import BASE_URL from "../Confi/baseurl";

const EditRuleEngine = () => {
  const { id } = useParams(); // Get the member ID from the URL
  const navigate = useNavigate();
  //   const [rule, setRule] = useState({
  //     conditions: [],
  //     actions: [],
  //   })
  const [conditions, setConditions] = useState([
    {
      id: 1,
      masterAttribute: "",
      subAttribute: "",
      masterOperator: "",
      subOperator: "",
      condition_type: "",
      value: "",
      master_operator: "",
    },
  ]);

  const [ruleName, setRuleName] = useState("");
  const [masterAttributes, setMasterAttributes] = useState([]);
  // @ts-ignore
  const [selectedMasterAttribute, setSelectedMasterAttribute] = useState("");
  const [subAttributes, setSubAttributes] = useState([]);

  const [masterRewardOutcomes, setMasterRewardOutcomes] = useState([]);
  const [selectedMasterRewardOutcomes, setSelectedMasterRewardOutcomes] =
    useState({ id: "", name: "" });
  const [subRewardOutcomes, setSubRewardOutcomes] = useState([]);
  const [subRewardOutcomesnew, setsubRewardOutcomesnew] = useState([]);

  // @ts-ignore
  const [selectedMasterOperator, setSelectedMasterOperator] = useState("");
  const [subOperators, setSubOperators] = useState([]);
  // @ts-ignore
  const [selectedSubOperator, setSelectedSubOperator] = useState("");

  const [error, setError] = useState("");
  const [parameter, setParameter] = useState("");
  const [previousValue, setPreviousValue] = useState("");
  const [actions, setActions] = useState([]);
  const [idAdd, setIdAdd] = useState(null);
  const [subRewardOutcomesName, setsubRewardOutcomesName] = useState({
    id: "",
    name: "",
  });
  const [funId, setFunId] = useState(null);
  const [masterRewardOutcomesLockModal, setMasterRewardOutcomesLockModal] =
    useState({ id: "", name: "" });
  const [lockModel, setLockModel] = useState("");

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
    const selectedMaster = masterOperators.find(
      (op) => op.name === selectedName
    );

    // Set subOperators based on the selected master operator
    // @ts-ignore
    setSubOperators(selectedMaster ? selectedMaster.subOptions : []);

    // Reset the sub operator selection
    setSelectedSubOperator("");
  };

  //get data
  const token = localStorage.getItem("access_token");

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
        // console.log(data)
        // setRule(data);
        setIdAdd(data.id);
        setRuleName(data.name);
        if (data.conditions) {
          console.log(data.conditions);
          setConditions(
            data.conditions.map((condition) => ({
              id: condition.id,
              masterAttribute: condition.model_name,
              subAttribute: condition.condition_attribute,
              subOperator: condition.operator,
              condition_type: condition.condition_type,
              value: condition.compare_value,
              master_operator: condition.master_operator,
            }))
          );
          console.log("set con:", conditions);
        }
        if (data.actions) {
          // console.log("action:",data.actions)
          // setactions(data.actions)
          // setParameter(data.actions.parameters)

          // Extract the parameters from the actions array
          const parameters = data.actions
            .map((action) => action.parameters)
            .flat();
          setParameter(parameters);
          const lock_model_name = data.actions.map((action) => ({
            id: action.action_selected_model,
            name: action.lock_model_name,
          }));
          console.log("....master reward", lock_model_name);
          // Set the parameters in state

          // setSelectedMasterRewardOutcomes({
          //     name:lock_model_name
          // })
          setMasterRewardOutcomesLockModal(
            lock_model_name[0] || {
              id: lock_model_name.id,
              name: lock_model_name.name,
            }
          );
          // const action_method=data.actions.map((action) => ({
          //     name: action.action_method,
          // }))
          // setsubRewardOutcomesnew(action_method)
          const action_method = data.actions.map((action) => ({
            id: action.rule_engine_available_function_id,
            name: action.action_method, // Extract `action_method` into the `name` property
          }));

          console.log("Action Methods:", action_method);

          // Set the state with the array of `action_method` values
          // setSelectedMasterRewardOutcomes(action_method[0] || { id:action_method.id,name: action_method.name })
          setsubRewardOutcomesName(
            action_method[0] || {
              id: action_method.id,
              name: action_method.name,
            }
          );
          console.log("sub action function id", subRewardOutcomesName);
          //   const action_id = data.actions.map((action) => ({
          //     name: action.id, // Extract `action_method` into the `name` property
          // }));
          // console.log("action id",action_id)
          // setActions(action_id)

          const action_ids = data.actions.map((action) => action.id).flat(); // Extract only the 'id' values
          console.log("Action IDs:", action_ids);

          setActions(action_ids); // Set the state as an array of IDs
          //    const selectedModatID=data.actions.map((action) => (
          //     action.action_selected_model// Extract `action_method` into the `name` property
          // ));
          //    console.log("selected modal id :",selectedModatID)
          //     setActionSelectedModal(selectedModatID[0])

          const functionId = data.actions[0]?.rule_engine_available_function_id;
          console.log("function id :", functionId);
          setFunId(functionId);

          const lock_model = data.actions[0]?.rule_engine_available_function_id;
          setLockModel(lock_model);
        }
      } catch (err) {
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchRule();
  }, [id]);

  const handleCancle = async () => {
    try {
      const data = await getRuleEngine(id);
      // console.log(data)
      // setRule(data);
      setIdAdd(data.id);
      setRuleName(data.name);
      if (data.conditions) {
        console.log(data.conditions);
        setConditions(
          data.conditions.map((condition) => ({
            id: condition.id,
            masterAttribute: condition.model_name,
            subAttribute: condition.condition_attribute,
            subOperator: condition.operator,
            condition_type: condition.condition_type,
            value: condition.compare_value,
            master_operator: condition.master_operator,
          }))
        );
        console.log("set con:", conditions);
      }
      if (data.actions) {
        // console.log("action:",data.actions)

        // Extract the parameters from the actions array
        const parameters = data.actions
          .map((action) => action.parameters)
          .flat();
        setParameter(parameters);
        const lock_model_name = data.actions.map((action) => ({
          id: action.action_selected_model,
          name: action.lock_model_name,
        }));
        console.log("....master reward", lock_model_name);

        setMasterRewardOutcomesLockModal(
          lock_model_name[0] || { id: "", name: "" }
        );

        const action_method = data.actions.map((action) => ({
          id: action.rule_engine_available_function_id,
          name: action.action_method, // Extract `action_method` into the `name` property
        }));

        console.log("Action Methods:", action_method);

        // Set the state with the array of `action_method` values
        setSelectedMasterRewardOutcomes(
          action_method[0] || { id: "", name: "" }
        );
        setsubRewardOutcomesName(action_method[0] || { name: "" });
        console.log("sub action function id", subRewardOutcomesName);
        const action_ids = data.actions.map((action) => action.id).flat(); // Extract only the 'id' values
        console.log("Action IDs:", action_ids);

        setActions(action_ids); // Set the state as an array of IDs

        const functionId = data.actions[0]?.rule_engine_available_function_id;
        console.log("function id :", functionId);
        setFunId(functionId);

        const lock_model = data.actions[0]?.lock_model_name;
        console.log("lock model :", lock_model);
        setLockModel(lock_model);
      }
    } catch (err) {
      // setError(err.message);
    } finally {
      // setLoading(false);
    }
  };
  // handleCancle()

  useEffect(() => {
    const getData = async () => {
      try {
        const companyId = 44; // Set this according to your needs
        const activeStatus = true; // Set this according to your needs
        const masterAttrs = await fetchMasterAttributes(
          companyId,
          activeStatus
        );
        setMasterAttributes(masterAttrs.master_attributes);

        const rewardOutcomes = await fetchMasterRewardOutcomes(
          companyId,
          activeStatus
        );
        setMasterRewardOutcomes(rewardOutcomes.master_reward_outcome);
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
    const selectedName = selectedOption.getAttribute("data-name"); // Get the data-name attribute    setSelectedMasterRewardOutcomes(selectedName);
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

        // const subRewardOutcomeIds = selectedSubRewardOutcomes.map(
        //     (subAttr) => subAttr.id
        // );
        // console.log("Sub Reward Outcome IDs:", subRewardOutcomeIds);
      } catch (error) {
        console.error("Error fetching sub attributes:", error);
      }
    } else {
      console.error("Selected ID not found in master attributes");
    }
  };
  // console.log('sub reward ,',subRewardOutcomesnew)

  //     // Handle Sub-Reward Outcome Selection
  // const handleSubRewardOutcomeChange = (e) => {
  //     const subRewardOutcomeId = e.target.value; // Get the selected sub-reward outcome ID
  //     console.log("Selected Sub Reward Outcome ID:", subRewardOutcomeId);

  //     // Pass the selected ID to the required function or store it in state
  //     setSelectedSubRewardOutcomeId(subRewardOutcomeId);
  // };

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
        master_operator: "",
      },
    ]);
  };

  const handleEdit = async (id) => {
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
    const values = conditions.map((cond) => cond.value);
    const uniqueValues = new Set();
    for (const value of values) {
      if (value.trim() === "") {
        // setError(" Please enter value.");
        return;
      }
      uniqueValues.add(value);
    }

    // @ts-ignore
    if (isNaN(parameter)) {
      setError("Parameter value must be a valid number.");
      return;
    }

    if (uniqueValues.size !== values.length) {
      setError("Each condition value must be unique.");
      return;
    }

    // Update previousValue to the current value before proceeding
    const newValue = conditions.map((cond) => cond.value);
    // @ts-ignore
    setPreviousValue(newValue); // Store the latest value(s) as the previous value]

    // const storedValue = sessionStorage.getItem("selectedId")

    const data = {
      rule_engine_rule: {
        id: idAdd,
        name: ruleName, // Ensure ruleName is defined elsewhere in your code
        description: "This is a description of the sample rule.",
        loyalty_type_id: sessionStorage.getItem("selectedId"), //type id
        // Mapping conditions dynamically
        rule_engine_conditions_attributes: conditions.map((condition) => ({
          id: condition.id,
          condition_attribute: condition.subAttribute || "", // Handle blank cases if needed
          operator: condition.subOperator || "",
          compare_value: condition.value || "",
          condition_selected_model: Number(condition.masterAttribute) || 1,
          condition_type: condition.condition_type || "",
          master_operator: condition.master_operator || "",
        })),

        rule_engine_actions_attributes: [
          {
            id: actions[0],
            lock_model_name:
              selectedMasterRewardOutcomes.name || lockModel || "",
            parameters: [Number(parameter) || ""],
            rule_engine_available_function_id:
              Number(subRewardOutcomesnew) || funId || "",
            action_selected_model:
              Number(
                selectedMasterRewardOutcomes.id ||
                  masterRewardOutcomesLockModal.id
              ) || "",
            // action_method:(subRewardOutcomesName.name)
          },
        ],

        // id: 288,
        // name: "Test 666666666666666",
        // description: "This is a descrsssssssiption of the sample rule.",
        // rule_engine_conditions_attributes: [
        //     {
        //         id: 267,
        //         condition_attribute: "creassssated_at",
        //         operator: "equals",
        //         compare_value: "input vsssaalue",
        //         condition_selected_model: 1,
        //         condition_type: "",
        //         action_type: "updassstae"
        //     },
        //     {
        //         id: 268,
        //         condition_attribute: "createdsss_aat",
        //         operator: "greater_than",
        //         compare_value: "a",
        //         condition_selected_model: 1,
        //         condition_type: "",
        //         action_type: "updatsae"

        //     }
        // ],
        // rule_engine_actions_attributes: [
        //     {
        //         id: 185,
        //         lock_model_name: "555",
        //         parameters: [1000010000010],
        //         rule_engine_available_function_id: 1,
        //         action_selected_model: 1
        //     }
        // ]
      },
    };

    console.log("Request Payload:", JSON.stringify(data, null, 2)); // Log the JSON payload for debugging
    console.log("id...", id);
    try {
      // @ts-ignore
      if (
        ruleName !== "" &&
        parameter !== "" &&
        selectedMasterRewardOutcomes !== "" &&
        conditions !== null
      ) {
        const response = await fetch(
          `${BASE_URL}/rule_engine/rules/loyalty_re_update.json?token=${token}
                    `,
          {
            method: "PUT", // Specify the request method
            headers: {
              "Content-Type": "application/json", // Set content type to JSON
            },
            body: JSON.stringify(data), // Convert the data to JSON
          }
        );

        if (response.ok) {
          const responseData = await response.json(); // Parse the JSON response
          // alert("Rule Engine created successfully!");
          navigate("/rule-engine");
          console.log("Data created successfully:", responseData);
          // clearInputs(); // Clear form inputs if needed
        } else {
          const errorData = await response.json(); // Parse error response
          // setError(`Failed to create Rule Engine: ${errorData.message}`);
          setError(`Please select master and sub reward outcome.`);
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
    const updatedConditions = conditions.filter(
      (condition) => condition.id !== id
    );
    setConditions(updatedConditions);
  };

  const renderCondition = (condition, index) => (
    <div key={condition.id} className="SetRuleCard">
      <div>
        <h6 className="mt-3">
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Condition {condition.id}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-square mb-1 ms-3 text-body-secondary"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
            {index > 0 && ( // Only show the button for conditions after the first one
              <button
                onClick={() => removeCondition(condition.id)}
                className="ms-3"
                // title="Remove Condition"
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
                    idx === index ? { ...cond, condition_type: "AND" } : cond
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
                    idx === index ? { ...cond, condition_type: "OR" } : cond
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
            {/* Attribute section */}
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
                className="p-1  mt-1 mb-1"
                style={{ fontSize: "12px", fontWeight: "400" }}
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
                <option value="">{condition.masterAttribute}</option>
                <option value="" disabled>
                  Select Master Attribute{" "}
                </option>
                {masterAttributes.map((attr) => (
                  <option
                    key={
                      // @ts-ignore
                      attr.id
                    }
                    value={attr.id}
                  >
                    {
                      // @ts-ignore
                      attr.display_name
                    }
                  </option>
                ))}
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
                className="p-1  mt-1 mb-1"
                style={{ fontSize: "12px", fontWeight: "400" }}
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
                <option value="">
                  {formatFieldName(condition.subAttribute)}
                </option>
                <option value="" disabled>
                  Select Sub Attribute
                </option>
                {subAttributes.map((subAttr) => (
                  <option
                    key={
                      // @ts-ignore
                      subAttr.id
                    }
                    value={subAttr.attribute_name}
                  >
                    {
                      // @ts-ignore
                      subAttr.display_name
                    }
                  </option>
                ))}
              </select>
            </fieldset>
          </div>
        </div>

        {/* Operator section */}
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
                style={{ fontSize: "12px", fontWeight: "400" }}
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
                <option value="">{condition.master_operator}</option>
                <option value="" disabled>
                  Select Master Operator{" "}
                </option>
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
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Sub Operator<span>*</span>
              </legend>
              <select
                // @ts-ignore
                required=""
                className="p-1  mt-1 mb-1"
                style={{ fontSize: "12px", fontWeight: "400" }}
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
                <option value="">
                  {formatFieldName(condition.subOperator)}
                </option>
                <option value="" disabled>
                  Select Sub Operator{" "}
                </option>
                {subOperators.map((subOp) => (
                  <option
                    key={
                      // @ts-ignore
                      subOp.id
                    }
                    value={subOp.value}
                  >
                    {
                      // @ts-ignore
                      subOp.name
                    }
                  </option>
                ))}
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
                style={{ fontSize: "12px", fontWeight: "400" }}
                placeholder="Enter Point Value"
                value={condition.value}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index ? { ...cond, value: e.target.value } : cond
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
                        &gt; Edit Rule
                    </p>
                    <h5 className="mb-3">
                        <span className="title" style={{ fontSize: '20px', fontWeight: '600' }}>New Rule</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            fill="currentColor"
                            className="bi bi-pencil-square mb-2 ms-3 text-body-secondary"
                            viewBox="0 0 16 16"
                        >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                                fill-rule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                        </svg>
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
                    style={{ fontSize: "12px", fontWeight: "400" }}
                    onChange={handleMasterSubRewardOutcomeChange}
                    value={
                      selectedMasterRewardOutcomes.id ||
                      masterRewardOutcomesLockModal.id ||
                      ""
                    } // Use the id directly from state
                  >
                    <option value="">
                      {formatFieldName(masterRewardOutcomesLockModal.name)}
                    </option>
                    <option value="" disabled>
                      Select Master Reward Outcome
                    </option>
                    {masterRewardOutcomes.map((reward) => (
                      <option
                        key={
                          // @ts-ignore
                          reward.id
                        }
                        value={reward.id}
                        data-name={reward.lock_model_name}
                      >
                        {
                          // @ts-ignore
                          reward.display_name
                        }
                      </option>
                    ))}
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
                    style={{ fontSize: "12px", fontWeight: "400" }}
                    disabled={!selectedMasterRewardOutcomes}
                    onChange={(e) => {
                      const selectedId = e.target.value; // Get the selected sub-reward outcome ID
                      console.log(selectedId);
                      // Handle the selection as needed, e.g., update the state or construct the data object
                      // @ts-ignore
                      setsubRewardOutcomesnew(selectedId);
                    }}
                    value={subRewardOutcomesnew || ""} // Ensure this reflects the selected sub-reward outcome
                  >
                    <option value="">
                      {formatFieldName(subRewardOutcomesName.name)}
                    </option>

                    <option value="" disabled>
                      Select Sub Reward Outcome
                    </option>

                    {subRewardOutcomes.map((reward) => (
                      <option
                        // @ts-ignore
                        key={reward.id}
                        // value={reward.rule_engine_available_model_id}
                        // @ts-ignore
                        value={reward.id}
                      >
                        {
                          // @ts-ignore
                          reward.display_name
                        }
                      </option>
                    ))}
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
                  <input
                    type="text"
                    placeholder="Enter Parameter Value"
                    value={parameter}
                    onChange={(e) => setParameter(e.target.value)}
                    className="mt-1 mb-1"
                    style={{ fontSize: "12px", fontWeight: "400" }}
                  />
                </fieldset>
              </div>
            </div>
          </div>

          {error && (
            <div className="error" style={{ color: "red" }}>
              {error}
            </div>
          )}

          {/* ..... */}
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                className="purple-btn1 w-100"
                onClick={() => handleEdit(id)}
              >
                Submit
              </button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn2 w-100" onClick={handleCancle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditRuleEngine;
