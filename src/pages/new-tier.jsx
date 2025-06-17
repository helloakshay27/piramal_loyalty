import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import SubHeader from "../components/SubHeader";
import RoundedRadioButtonCard from "../components/RoundedRadioButtonCard";
import BASE_URL from "../Confi/baseurl";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tier name is required"),
  exit_points: Yup.number()
    .required("Exit points are required")
    .positive("Exit points must be a positive number"),
  multipliers: Yup.number()
    .required("Multipliers are required")
    .positive("Multipliers must be a positive number"),
  welcome_bonus: Yup.number()
    .required("Welcome bonus is required")
    .positive("Welcome bonus must be a positive number"),
  point_type: Yup.string().required("Point type is required"),
  tiers: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Tier name is required"),
      exit_points: Yup.number()
        .required("Exit points are required")
        .positive("Exit points must be a positive number"),
      multipliers: Yup.number()
        .required("Multipliers are required")
        .positive("Multipliers must be a positive number"),
      welcome_bonus: Yup.number()
        .required("Welcome bonus is required")
        .positive("Welcome bonus must be a positive number"),
    })
  ),
});

const NewTier = () => {
  const [step, setStep] = useState(1);
  const [timeframe, setTimeframe] = useState("");
  const [timeframeError, setTimeframeError] = useState("");
  const [tiers, setTiers] = useState([]);
  const navigate = useNavigate();

  const storedValue = sessionStorage.getItem("selectedId");
  const token = localStorage.getItem("access_token");

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
    setTimeframeError("");
  };

  const nextStep = () => {
    if (step === 1 && timeframe) {
      setStep(2);
    } else if (!timeframe) {
      setTimeframeError("Please select a timeframe.");
    }
  };

  const cancelStep = () => {
    setStep(1);
    setTimeframe("");
    setTimeframeError("");
  };

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }
  ) => {
    const formattedTiers = values.tiers?.map((tier) => ({
      loyalty_type_id: Number(storedValue),
      name: tier.name,
      exit_points: Number(tier.exit_points),
      multipliers: Number(tier.multipliers),
      welcome_bonus: Number(tier.welcome_bonus),
      point_type: timeframe,
    }));

    const newTier = {
      loyalty_type_id: Number(storedValue),
      name: values.name,
      exit_points: Number(values.exit_points),
      multipliers: Number(values.multipliers),
      welcome_bonus: Number(values.welcome_bonus),
      point_type: timeframe,
    };

    const data = {
      loyalty_tier:
        formattedTiers?.length > 0 ? [...formattedTiers, newTier] : newTier,
    };

    try {
      // const token = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"; // Ensure to replace with your token
      const url =
        formattedTiers?.length > 0
          ? `${BASE_URL}/loyalty/tiers/bulk_create?token=${token}`
          : `${BASE_URL}/loyalty/tiers.json?token=${token}`;

      console.log("Final URL:", url);
      console.log("Data Sent:", JSON.stringify(data, null, 2));

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        setStatus({ success: "Tier created successfully!" });
        resetForm();
        navigate("/tiers");
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      setStatus({
        error: error.message || "Failed to create tier. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-100" style={{ height: "90%" }}>
      {/* <SubHeader /> */}
      {step === 1 && (
        <div
          className="module-data-section mt-2 flex-grow-1"
          style={{ position: "relative", height: "100%" }}
        >
          <p className="pointer">
            <Link to={"/tiers"}>
              <span>Tiers</span>
            </Link>{" "}
            &gt; Tier Setting
          </p>
          <div
            className="mx-3 border-bottom"
            style={{ fontSize: "16px", paddingBottom: "20px" }}
          >
            <h5 className="d-flex">
              <span className="title mt-3" style={{ fontSize: "22px" }}>
                TIER SETTING
              </span>
            </h5>
            <p className="mt-5 ms-4 fw-semibold">
              Point Accumulation Timeframe
            </p>
            <p className="ms-4 text-muted">
              Establish how members enter into higher tiers on points earning
              and time frame.
            </p>
          </div>
          <RoundedRadioButtonCard onChange={handleTimeframeChange} />
          {timeframeError && (
            <div className="text-danger ms-4">{timeframeError}</div>
          )}
          <div
            className="row mt-2 justify-content-center align-items-center"
            style={{ position: "absolute", bottom: 0, width: "100%" }}
          >
            <div className="col-md-2">
              <button className="purple-btn1 w-100" onClick={nextStep}>
                Next
              </button>
            </div>
            <div className="col-md-2">
              <button
                className="purple-btn2 w-100"
                onClick={() => navigate("/tiers")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="module-data-section mt-2" style={{ height: "85%" }}>
          <p className="pointer">
            <span>Tier</span> &gt; New Tier
          </p>
          <h5 className="mb-3">
            <span className="title">New Tier</span>
          </h5>
          <Formik
            initialValues={{
              name: "",
              exit_points: "",
              multipliers: "",
              welcome_bonus: "",
              point_type: timeframe,
              tiers: [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting }) => (
              <Form
                className="go-shadow px-3 d-flex justify-content-between"
                style={{
                  height: "100%",
                  flexDirection: "column",
                  marginRight: "26px",
                  overflowY: "auto",
                }}
              >
                <div>
                  <div className="row">
                    <div className="col-md-3 col-sm-11 mb-3">
                      <fieldset className="border">
                        <legend className="float-none">
                          Tier Name<span>*</span>
                        </legend>
                        <Field
                          name="name"
                          placeholder="Enter Tier Name"
                          className="form-control border-0"
                        />
                      </fieldset>
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="col-md-3 col-sm-11 mb-3">
                      <fieldset className="border">
                        <legend className="float-none">
                          Exit Points<span>*</span>
                        </legend>
                        <Field
                          name="exit_points"
                          placeholder="Enter Exit Points"
                          type="number"
                          className="form-control border-0"
                        />
                      </fieldset>
                      <ErrorMessage
                        name="exit_points"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="col-md-3 col-sm-11 mb-3">
                      <fieldset className="border">
                        <legend className="float-none">
                          Multipliers<span>*</span>
                        </legend>
                        <Field
                          name="multipliers"
                          placeholder="Enter Multipliers"
                          type="number"
                          className="form-control border-0"
                        />
                      </fieldset>
                      <ErrorMessage
                        name="multipliers"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="col-md-3 col-sm-11 mb-3">
                      <fieldset className="border">
                        <legend className="float-none">
                          Welcome Bonus<span>*</span>
                        </legend>
                        <Field
                          name="welcome_bonus"
                          placeholder="Enter Welcome Bonus"
                          type="number"
                          className="form-control border-0"
                        />
                      </fieldset>
                      <ErrorMessage
                        name="welcome_bonus"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <FieldArray name="tiers">
                    {({ insert, remove, push }) => (
                      <div style={{ marginTop: "20px" }}>
                        {values.tiers.length > 0 &&
                          values.tiers.map((tier, index) => (
                            <div
                              className="row"
                              key={index}
                              style={{ paddingBottom: "20px" }}
                            >
                              <div className="col-md-3 col-sm-11 mb-3">
                                <fieldset className="border">
                                  <legend className="float-none">
                                    Tier Name<span>*</span>
                                  </legend>
                                  <Field
                                    name={`tiers[${index}].name`}
                                    placeholder="Enter Tier Name"
                                    className="form-control border-0"
                                  />
                                </fieldset>
                                <ErrorMessage
                                  name={`tiers[${index}].name`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-md-3 col-sm-11 mb-3">
                                <fieldset className="border">
                                  <legend className="float-none">
                                    Exit Points<span>*</span>
                                  </legend>
                                  <Field
                                    name={`tiers[${index}].exit_points`}
                                    placeholder="Enter Exit Points"
                                    type="number"
                                    className="form-control border-0"
                                  />
                                </fieldset>
                                <ErrorMessage
                                  name={`tiers[${index}].exit_points`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-md-3 col-sm-11 mb-3">
                                <fieldset className="border">
                                  <legend className="float-none">
                                    Multipliers<span>*</span>
                                  </legend>
                                  <Field
                                    name={`tiers[${index}].multipliers`}
                                    placeholder="Enter Multipliers"
                                    type="number"
                                    className="form-control border-0"
                                  />
                                </fieldset>
                                <ErrorMessage
                                  name={`tiers[${index}].multipliers`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-md-3 col-sm-11 mb-3">
                                <fieldset className="border">
                                  <legend className="float-none">
                                    Welcome Bonus<span>*</span>
                                  </legend>
                                  <Field
                                    name={`tiers[${index}].welcome_bonus`}
                                    placeholder="Enter Welcome Bonus"
                                    type="number"
                                    className="form-control border-0"
                                  />
                                </fieldset>
                                <ErrorMessage
                                  name={`tiers[${index}].welcome_bonus`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-md-12 text-end">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  style={{ padding: "10px" }}
                                  onClick={() => remove(index)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-x"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        <button
                          type="button"
                          className="purple-btn1"
                          onClick={() =>
                            push({
                              name: "",
                              exit_points: "",
                              multipliers: "",
                              welcome_bonus: "",
                            })
                          }
                        >
                          Add New Tier
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="row justify-content-center align-items-center">
                  <div className="col-md-2">
                    <button
                      type="submit"
                      className="purple-btn1 w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Submit"}
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      type="reset"
                      className="purple-btn2 w-100"
                      onClick={() => {
                        setTiers([]);
                        cancelStep();
                        console.log("step :---", step);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default NewTier;
