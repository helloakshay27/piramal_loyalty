// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";
// import { useNavigate } from "react-router-dom";

// const NewCampaign = () => {
//   const navigate = useNavigate();
//   const [tierLevels, setTierLevels] = useState([]);
//   const storedValue = sessionStorage.getItem("selectedId");
//   console.log("Stored ID in session after selection:", storedValue);

//   // Form validation schema
//   const validationSchema = Yup.object({
//     name: Yup.string().required("Campaign name is required."),
//     target_audiance: Yup.string().required("Target audience is required."),
//     campaign_type: Yup.string().required("Campaign type is required."),
//     loyalty_tier_id: Yup.string().required("Tier level is required."),
//     loyalty_type_id: Yup.string().required("Loyalty type id is required."),
//   });

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       target_audiance: "",
//       campaign_type: "",
//       loyalty_tier_id: "",
//       campaign_reward: false,
//       loyalty_type_id: storedValue
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       const data = {
//         loyalty_campaign: {
//           name: values.name,
//           target_audiance: values.target_audiance,
//           campaign_type: values.campaign_type,
//           loyalty_tier_id: Number(values.loyalty_tier_id), // Convert to number
//           campaign_reward: values.campaign_reward ? "true" : "false", // Convert to string
//           loyalty_type_id: storedValue
//         },

//       };

//       try {
//         const response = await axios.post(
//           "https://staging.lockated.com/loyalty/campaigns.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
//           data
//         );

//         console.log("Data to be sent:", data);

//         if (response.status === 201) {
//           // alert("Campaign created successfully!");
//           formik.resetForm();
//           navigate("/campaign");
//         }
//       } catch (error) {
//         console.error(
//           "Error posting data:",
//           error.response ? error.response.data : error.message
//         );
//         alert("Failed to create campaign. Please try again.");
//       }
//     },
//   });

// //tier level
//   useEffect(() => {
//     const fetchTierLevels = async () => {
//       const storedValue = sessionStorage.getItem("selectedId");
//       console.log("Stored ID in session after selection:", storedValue);
//       try {
//         const response = await axios.get(
//           `https://staging.lockated.com/loyalty/tiers.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&&q[loyalty_type_id_eq]=${storedValue}`
//         );
//         setTierLevels(response.data);
//         // Store API data in state
//         console.log(response.data)
//       } catch (error) {
//         console.error("Error fetching tier levels:", error);
//       }
//     };

//     fetchTierLevels();
//   }, []);

//   return (
//     <>
//       <div className="module-data-section mt-2">
//         <p className="pointer">
//           <span className="text-secondary">Campaign</span> &gt; New Campaign
//         </p>
//         <h5 className="mb-3 title">New Campaign</h5>
//         <form onSubmit={formik.handleSubmit} className="go-shadow me-3 pt-3">
//           <div className="border-bottom pb-2">
//             <div className="row">
//               <div className="col-md-11">
//                 <input
//                   className="border w-100 p-2 py-2"
//                   placeholder="Enter Campaign Name"
//                   name="name"
//                   value={formik.values.name}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//                 {formik.touched.name && formik.errors.name ? (
//                   <p className="text-danger">{formik.errors.name}</p>
//                 ) : null}
//               </div>
//             </div>
//             <div className="row ms-1 mt-4">
//               <fieldset className="border col-lg-3 col-md-5 col-sm-11 me-2">
//                 <legend className="float-none">
//                   Target Audience<span>*</span>
//                 </legend>
//                 <select
//                   name="target_audiance"
//                   value={formik.values.target_audiance}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   required=""
//                 >
//                   <option value="">Select Target Audience</option>
//                   <option value="Recently Joined">Recently Joined</option>
//                   <option value="Suspended">Suspended</option>
//                   <option value="1 - purchase">1 - purchase</option>
//                   <option value="No purchase">No purchase</option>
//                 </select>
//                 {formik.touched.target_audiance &&
//                   formik.errors.target_audiance ? (
//                   <p className="text-danger">{formik.errors.target_audiance}</p>
//                 ) : null}
//               </fieldset>

//               <fieldset className="border col-lg-3 col-md-5 col-sm-11 me-2">
//                 <legend className="float-none">
//                   Campaign Type<span>*</span>
//                 </legend>
//                 <select
//                   name="campaign_type"
//                   value={formik.values.campaign_type}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   required=""
//                 >
//                   <option value="">Select Campaign Type</option>
//                   <option value="Point based">Point based</option>
//                   <option value="Discount based">Discount based</option>
//                   <option value="Referral Campaign">Referral Campaign</option>
//                   <option value="Tier - Up Campaign">Tier - Up Campaign</option>
//                   <option value="Custom Campaign">Custom Campaign</option>
//                 </select>
//                 {formik.touched.campaign_type && formik.errors.campaign_type ? (
//                   <p className="text-danger">{formik.errors.campaign_type}</p>
//                 ) : null}
//               </fieldset>

//               <fieldset className="border col-lg-3 col-md-5 col-sm-11">
//                 <legend className="float-none">
//                   Tier Level<span>*</span>
//                 </legend>
//                 <select
//                   name="loyalty_tier_id"
//                   value={formik.values.loyalty_tier_id}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   required=""
//                 >
//                   {/* <option value="">Select Tier Level</option>
//                   <option value="1">Bronze</option>
//                   <option value="2">Silver</option>
//                   <option value="3">Gold</option> */}
//                   <option value="">Select Tier Level</option>
//                   {
//                     tierLevels?.map((tier, index) => (
//                       <option key={tier.id} value={tier.id}>{tier.display_name}</option>

//                     ))
//                   }
//                 </select>
//                 {formik.touched.loyalty_tier_id &&
//                   formik.errors.loyalty_tier_id ? (
//                   <p className="text-danger">{formik.errors.loyalty_tier_id}</p>
//                 ) : null}
//               </fieldset>
//             </div>
//           </div>
//           <div className="mt-2">
//             <p className="fw-bold">
//               Points Criteria <span>*</span>
//             </p>
//             <p>
//               <input
//                 className="align-middle mx-2"
//                 type="checkbox"
//                 name="campaign_reward"
//                 checked={formik.values.campaign_reward}
//                 onChange={formik.handleChange}
//               />
//               <span className="align-middle">
//                 Send points to existing members.
//               </span>
//             </p>
//           </div>
//           <div className="mt-5">
//             <p className="fw-bold">
//               Campaign Rewards <span>*</span>
//             </p>
//           </div>
//           <div className="row mt-2 justify-content-center">
//             <div className="col-md-2">
//               <button type="submit" className="purple-btn1 w-100">
//                 Submit
//               </button>
//             </div>
//             <div className="col-md-2">
//               <button
//                 type="button"
//                 className="purple-btn2 w-100"
//                 onClick={formik.handleReset}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default NewCampaign;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BASE_URL from "../Confi/baseurl";

const NewCampaign = () => {
  const navigate = useNavigate();
  const [tierLevels, setTierLevels] = useState([]);
  const [formValues, setFormValues] = useState({
    name: "",
    target_audiance: "",
    campaign_type: "",
    loyalty_tier_id: "",
    campaign_reward: false,
    loyalty_type_id: sessionStorage.getItem("selectedId"),
  });
  // @ts-ignore
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("access_token");

  // Fetch tier levels
  useEffect(() => {
    const fetchTierLevels = async () => {
      const storedValue = sessionStorage.getItem("selectedId");
      try {
        const response = await axios.get(
          `${BASE_URL}/loyalty/tiers.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
        );
        setTierLevels(response.data);
      } catch (error) {
        console.error("Error fetching tier levels:", error);
      }
    };
    fetchTierLevels();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });

    // setFormValues({
    //     ...formValues,
    //     [e.target.name]: e.target.checked,
    //   });
  };

  // const validate = () => {
  //   const newErrors = {};
  //   if (!formValues.name) newErrors.name = "Campaign name is required.";
  //   if (!formValues.target_audiance) newErrors.target_audiance = "Target audience is required.";
  //   if (!formValues.campaign_type) newErrors.campaign_type = "Campaign type is required.";
  //   if (!formValues.loyalty_tier_id) newErrors.loyalty_tier_id = "Tier level is required.";
  //   return newErrors;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const newErrors = validate();
    // if (Object.keys(newErrors).length) {
    //   setErrors(newErrors);
    //   return;
    // }

    // Validate required fields
    // if (!formValues.name ||
    //   !formValues.target_audiance ||
    //   !formValues.campaign_type ||
    //   !formValues.loyalty_tier_id
    //   // ||
    //   // !formValues.campaign_reward
    // ) {
    //   // setError("All fields are required.");
    //   toast.error("All Mandatory field are required", {
    //     position: "top-center",
    //     autoClose: 3000,
    //   });
    //   return;
    // }

    if (!formValues.name) {
      toast.error("Campaign Name is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!formValues.target_audiance) {
      toast.error("Target Audience is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!formValues.campaign_type) {
      toast.error("Campaign Type is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!formValues.loyalty_tier_id) {
      toast.error("Tier Level is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Uncomment and use this when the reward validation is needed
    if (!formValues.campaign_reward) {
      toast.error("Points Criteria & Campaign Reward is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Proceed with further logic if all validations pass

    const data = {
      loyalty_campaign: {
        name: formValues.name,
        target_audiance: formValues.target_audiance,
        campaign_type: formValues.campaign_type,
        loyalty_tier_id: Number(formValues.loyalty_tier_id),
        campaign_reward: formValues.campaign_reward ? "true" : "false",
        loyalty_type_id: formValues.loyalty_type_id,
      },
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/loyalty/campaigns.json?token=${token}`,
        data
      );
      if (response.status === 201) {
        setFormValues({
          name: "",
          target_audiance: "",
          campaign_type: "",
          loyalty_tier_id: "",
          campaign_reward: false,
          loyalty_type_id: sessionStorage.getItem("selectedId"),
        });
        navigate("/campaign");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to create campaign. Please try again.");
    }
  };

  return (
    <div className="module-data-section mt-2">
      <p className="pointer">
        <Link to="/campaign">
          <span>Campaign</span>
        </Link>{" "}
        &gt; New Campaign
      </p>
      <h5
        className="mb-3 title"
        style={{ fontSize: "20px", fontWeight: "600" }}
      >
        New Campaign
      </h5>
      <form
        onSubmit={handleSubmit}
        className="go-shadow me-3 pt-3"
        // style={{
        //   height: "100%",
        //   flexDirection: "column",
        //   marginRight: "26px",
        // }}
      >
        <div
          className="border-bottom pb-5 "
          style={{ border: "border: 0.5px solid #3A3A33" }}
        >
          <div className="row">
            <div className="col-md-11">
              <input
                className="border w-100 p-2 py-2"
                placeholder="Enter Campaign Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                style={{ fontSize: "12px", fontWeight: "400" }}
              />
              {// @ts-ignore
              errors.name && <p className="text-danger">{errors.name}</p>}
            </div>
          </div>
          <div className="row ms-1 mt-4">
            <fieldset className="border col-lg-3 col-md-5 col-sm-11 me-2">
              <legend
                className="float-none"
                // @ts-ignore
                ClassName=""
                style={{
                  fontSize: "14px", // Adjust font size for visibility
                  fontWeight: "400",
                  padding: "6px", // Padding to ensure full visibility of text
                  lineHeight: "1.2", // Adjust line-height for better readability
                  marginBottom: "-8px", // Slight negative margin if legend is too high
                }}
              >
                Target Audience<span>*</span>
              </legend>
              <select
                style={{ fontSize: "12px", fontWeight: "400" }}
                name="target_audiance"
                value={formValues.target_audiance}
                onChange={handleChange}
                // @ts-ignore
                required=""
                className="mt-1 mb-1"
              >
                <option value="">Select Target Audience</option>
                <option value="Recently Joined">Recently Joined</option>
                <option value="Suspended">Suspended</option>
                <option value="1 - purchase">1 - purchase</option>
                <option value="No purchase">No purchase</option>
              </select>
              {// @ts-ignore
              errors.target_audiance && (
                <p className="text-danger">{errors.target_audiance}</p>
              )}
            </fieldset>

            <fieldset className="border col-lg-3 col-md-5 col-sm-11 me-2">
              <legend
                className="float-none"
                style={{
                  fontWeight: "400",

                  fontSize: "14px", // Adjust font size for visibility

                  padding: "6px", // Padding to ensure full visibility of text
                  lineHeight: "1.2", // Adjust line-height for better readability
                  marginBottom: "-8px", // Slight negative margin if legend is too high
                }}
              >
                Campaign Type<span>*</span>
              </legend>
              <select
                style={{ fontSize: "12px", fontWeight: "400" }}
                name="campaign_type"
                value={formValues.campaign_type}
                onChange={handleChange}
                // @ts-ignore
                required=""
                className="mt-1 mb-1"
              >
                <option value="">Select Campaign Type</option>
                <option value="Point based">Point based</option>
                <option value="Discount based">Discount based</option>
                <option value="Referral Campaign">Referral Campaign</option>
                <option value="Tier - Up Campaign">Tier - Up Campaign</option>
                <option value="Custom Campaign">Custom Campaign</option>
              </select>
              {// @ts-ignore
              errors.campaign_type && (
                <p className="text-danger">{errors.campaign_type}</p>
              )}
            </fieldset>

            <fieldset className="border col-lg-3 col-md-5 col-sm-11">
              <legend
                className="float-none"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",

                  // @ts-ignore
                  fontSize: "14px", // Adjust font size for visibility

                  padding: "6px", // Padding to ensure full visibility of text
                  lineHeight: "1.2", // Adjust line-height for better readability
                  marginBottom: "-8px", // Slight negative margin if legend is too high
                }}
              >
                Tier Level<span>*</span>
              </legend>
              <select
                style={{ fontSize: "12px", fontWeight: "400" }}
                name="loyalty_tier_id"
                value={formValues.loyalty_tier_id}
                onChange={handleChange}
                // @ts-ignore
                required=""
                className="mt-1 mb-1"
              >
                <option value="">Select Tier Level</option>
                {tierLevels.map((tier) => (
                  <option
                    key={
                      // @ts-ignore
                      tier.id
                    }
                    value={tier.id}
                  >
                    {tier.display_name}
                  </option>
                ))}
              </select>
              {// @ts-ignore
              errors.loyalty_tier_id && (
                <p className="text-danger">{errors.loyalty_tier_id}</p>
              )}
            </fieldset>
          </div>
        </div>

        <div className="mt-2">
          <p
            className="fw-bold"
            style={{ fontSize: "16px", fontWeight: "500" }}
          >
            Points Criteria<span style={{ color: "#E95420" }}>*</span>
          </p>
          <p>
            <input
              className="align-middle mx-2 custom-checkbox"
              type="checkbox"
              name="campaign_reward"
              checked={formValues.campaign_reward}
              onChange={handleChange}
            />
            <span
              className="align-middle"
              style={{
                color: "#00000099",
                fontSize: "13.63px",
                fontWeight: "400",
              }}
            >
              Send points to existing members.
            </span>
          </p>
        </div>

        <div
          className="mt-5 border-bottom"
          style={{
            border: "border: 0.5px solid #3A3A33",
            paddingBottom: "50px",
          }}
        >
          <p
            className="fw-bold"
            style={{ fontSize: "16px", fontWeight: "600" }}
          >
            Campaign Rewards<span style={{ color: "#E95420" }}>*</span>
          </p>
        </div>
        <div
          className="row  justify-content-center"
          style={{ marginTop: "55px" }}
        >
          <div className="col-md-2">
            <button type="submit" className="purple-btn1 w-100">
              Submit
            </button>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="purple-btn2 w-100"
              onClick={() =>
                setFormValues({
                  name: "",
                  target_audiance: "",
                  campaign_type: "",
                  loyalty_tier_id: "",
                  campaign_reward: false,
                  loyalty_type_id: sessionStorage.getItem("selectedId"),
                })
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default NewCampaign;

// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
// import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS

// const NewCampaign = () => {
//   const navigate = useNavigate();
//   const [tierLevels, setTierLevels] = useState([]);
//   const storedValue = sessionStorage.getItem("selectedId");

//   // Form validation schema
//   const validationSchema = Yup.object({
//     name: Yup.string().required("Campaign name is required."),
//     target_audiance: Yup.string().required("Target audience is required."),
//     campaign_type: Yup.string().required("Campaign type is required."),
//     loyalty_tier_id: Yup.string().required("Tier level is required."),
//     loyalty_type_id: Yup.string().required("Loyalty type id is required."),
//   });

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       target_audiance: "",
//       campaign_type: "",
//       loyalty_tier_id: "",
//       campaign_reward: false,
//       loyalty_type_id: storedValue,
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       const data = {
//         loyalty_campaign: {
//           name: values.name,
//           target_audiance: values.target_audiance,
//           campaign_type: values.campaign_type,
//           loyalty_tier_id: Number(values.loyalty_tier_id),
//           campaign_reward: values.campaign_reward ? "true" : "false",
//           loyalty_type_id: storedValue,
//         },
//       };

//       try {
//         const response = await axios.post(
//           "https://staging.lockated.com/loyalty/campaigns.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
//           data
//         );

//         if (response.status === 201) {
//           alert("Campaign created successfully!");
//           formik.resetForm();
//           navigate("/campaign");
//         }
//       } catch (error) {
//         console.error(
//           "Error posting data:",
//           error.response ? error.response.data : error.message
//         );
//         alert("Failed to create campaign. Please try again.");
//       }
//     },
//   });

//   // Fetch tier levels
//   useEffect(() => {
//     const fetchTierLevels = async () => {
//       try {
//         const response = await axios.get(
//           `https://staging.lockated.com/loyalty/tiers.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&&q[loyalty_type_id_eq]=${storedValue}`
//         );
//         setTierLevels(response.data);
//       } catch (error) {
//         console.error("Error fetching tier levels:", error);
//       }
//     };

//     fetchTierLevels();
//   }, []);

//   // Handle validation errors for required fields
//   const handleValidationError = (field) => {
//     if (formik.touched[field] && formik.errors[field]) {
//       toast.error(formik.errors[field]);
//     }
//   };

//   return (
//     <>
//       <ToastContainer /> {/* Add ToastContainer here */}
//       <div className="module-data-section mt-2">
//         <p className="pointer">
//           <span className="text-secondary">Campaign</span> &gt; New Campaign
//         </p>
//         <h5 className="mb-3 title">New Campaign</h5>
//         <form onSubmit={formik.handleSubmit} className="go-shadow me-3 pt-3">
//           <div className="border-bottom pb-2">
//             <div className="row">
//               <div className="col-md-11">
//                 <input
//                   className="border w-100 p-2 py-2"
//                   placeholder="Enter Campaign Name"
//                   name="name"
//                   value={formik.values.name}
//                   onChange={formik.handleChange}
//                   onBlur={() => {
//                     formik.handleBlur();
//                     handleValidationError("name");
//                   }}
//                 />
//                 {formik.touched.name && formik.errors.name ? (
//                   <p className="text-danger">{formik.errors.name}</p>
//                 ) : null}
//               </div>
//             </div>
//             <div className="row ms-1 mt-4">
//               <fieldset className="border col-lg-3 col-md-5 col-sm-11 me-2">
//                 <legend className="float-none">
//                   Target Audience<span>*</span>
//                 </legend>
//                 <select
//                   name="target_audiance"
//                   value={formik.values.target_audiance}
//                   onChange={formik.handleChange}
//                   onBlur={() => {
//                     formik.handleBlur();
//                     handleValidationError("target_audiance");
//                   }}
//                   required
//                 >
//                   <option value="">Select Target Audience</option>
//                   <option value="Recently Joined">Recently Joined</option>
//                   <option value="Suspended">Suspended</option>
//                   <option value="1 - purchase">1 - purchase</option>
//                   <option value="No purchase">No purchase</option>
//                 </select>
//                 {formik.touched.target_audiance &&
//                   formik.errors.target_audiance ? (
//                   <p className="text-danger">{formik.errors.target_audiance}</p>
//                 ) : null}
//               </fieldset>

//               <fieldset className="border col-lg-3 col-md-5 col-sm-11 me-2">
//                 <legend className="float-none">
//                   Campaign Type<span>*</span>
//                 </legend>
//                 <select
//                   name="campaign_type"
//                   value={formik.values.campaign_type}
//                   onChange={formik.handleChange}
//                   onBlur={() => {
//                     formik.handleBlur();
//                     handleValidationError("campaign_type");
//                   }}
//                   required
//                 >
//                   <option value="">Select Campaign Type</option>
//                   <option value="Point based">Point based</option>
//                   <option value="Discount based">Discount based</option>
//                   <option value="Referral Campaign">Referral Campaign</option>
//                   <option value="Tier - Up Campaign">Tier - Up Campaign</option>
//                   <option value="Custom Campaign">Custom Campaign</option>
//                 </select>
//                 {formik.touched.campaign_type && formik.errors.campaign_type ? (
//                   <p className="text-danger">{formik.errors.campaign_type}</p>
//                 ) : null}
//               </fieldset>

//               <fieldset className="border col-lg-3 col-md-5 col-sm-11">
//                 <legend className="float-none">
//                   Tier Level<span>*</span>
//                 </legend>
//                 <select
//                   name="loyalty_tier_id"
//                   value={formik.values.loyalty_tier_id}
//                   onChange={formik.handleChange}
//                   onBlur={() => {
//                     formik.handleBlur();
//                     handleValidationError("loyalty_tier_id");
//                   }}
//                   required
//                 >
//                   <option value="">Select Tier Level</option>
//                   {tierLevels?.map((tier) => (
//                     <option key={tier.id} value={tier.id}>
//                       {tier.display_name}
//                     </option>
//                   ))}
//                 </select>
//                 {formik.touched.loyalty_tier_id &&
//                   formik.errors.loyalty_tier_id ? (
//                   <p className="text-danger">{formik.errors.loyalty_tier_id}</p>
//                 ) : null}
//               </fieldset>
//             </div>
//           </div>
//           <div className="mt-2">
//             <p className="fw-bold">
//               Points Criteria <span>*</span>
//             </p>
//             <p>
//               <input
//                 className="align-middle mx-2"
//                 type="checkbox"
//                 name="campaign_reward"
//                 checked={formik.values.campaign_reward}
//                 onChange={formik.handleChange}
//               />
//               <span className="align-middle">
//                 Send points to existing members.
//               </span>
//             </p>
//           </div>
//           <div className="mt-5">
//             <p className="fw-bold">
//               Campaign Rewards <span>*</span>
//             </p>
//           </div>
//           <div className="row mt-2 justify-content-center">
//             <div className="col-md-2">
//               <button type="submit" className="purple-btn1 w-100">
//                 Submit
//               </button>
//             </div>
//             <div className="col-md-2">
//               <button
//                 type="button"
//                 className="purple-btn2 w-100"
//                 onClick={formik.handleReset}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default NewCampaign;
