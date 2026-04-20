import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EventBackToListButton from "../components/EventBackToListButton";
import SelectBox from "../components/base/SelectBox";
import BASE_URL from "../Confi/baseurl";

const EventCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event_type: "",
    event_name: "",
    event_at: "",
    from_time: "",
    to_time: "",
    rsvp_action: "",
    description: "",
    publish: "",
    user_id: "",
    comment: "",
    shared: "",
    share_groups: "",
    attachfiles: [],
    is_important: "",
    email_trigger_enabled: "",
  });

  // console.log("formData", formData);
  const [eventType, setEventType] = useState([]);
  const [eventUserID, setEventUserID] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");




  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // for multiple image files
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validFiles = selectedFiles.filter((file) => allowedTypes.includes(file.type));
    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
      e.target.value = "";
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachfiles: [...prevFormData.attachfiles, ...validFiles],
    }));
  };

  // Remove individual image
  const removeImage = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachfiles: prevFormData.attachfiles.filter((_, index) => index !== indexToRemove),
    }));
  };

  useEffect(() => {
    // console.log("Updated attachfiles:", formData.attachfiles);
  }, [formData.attachfiles]);

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the state with the radio button's value
    }));
  };

  const getTodayLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getNowLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const fileData = selectedFiles.map((file) => ({
      file: file,
      name: file.name,
      type: file.type,
      url: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setFiles([...files, ...fileData]);
  };

  const hasValidEventMedia = (fd) => {
    return Array.isArray(fd.attachfiles) && fd.attachfiles.some((f) => f instanceof File);
  };

  /** First invalid field only (same order as the form, top to bottom). */
  const getFirstValidationError = (fd, projectId) => {
    if (!projectId) return "Project is required.";
    if (!fd.event_type) return "Event type is required.";
    if (!String(fd.event_name || "").trim()) return "Event name is required.";
    if (!String(fd.event_at || "").trim()) return "Event at is required.";
    const nowLocal = getNowLocal();

    if (!fd.from_time) return "Event from time is required.";
    if (fd.from_time > nowLocal) return "Event from time cannot be in the future.";

    if (!fd.to_time) return "Event to time is required.";
    if (fd.to_time < fd.from_time) {
      return "Event to time must be after from time.";
    }
    if (fd.rsvp_action === "yes") {
      if (!String(fd.rsvp_name || "").trim()) return "RSVP name is required.";
      if (!String(fd.rsvp_number || "").trim()) return "RSVP number is required.";
    }
    if (!String(fd.description || "").trim()) return "Event description is required.";
    if (!hasValidEventMedia(fd)) return "At least one event image is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    const firstError = getFirstValidationError(formData, selectedProjectId);
    if (firstError) {
      toast.error(firstError);
      return;
    }

    setLoading(true);

    // Create FormData to send with the request
    const data = new FormData();
    data.append("event[event_type]", formData.event_type);
    data.append("event[event_name]", formData.event_name);
    data.append("event[event_at]", formData.event_at);
    data.append("event[from_time]", formData.from_time);
    data.append("event[to_time]", formData.to_time);
    // data.append("event[rsvp_action]", formData.rsvp_action);
    data.append("event[description]", formData.description);
    // data.append("event[publish]", formData.publish);
    // data.append("event[user_id]", formData.user_id);
    // data.append("event[comment]", formData.comment);
    // data.append("event[shared]", formData.shared);
    // data.append("event[share_groups]", formData.share_groups);
    // data.append("event[is_important]", formData.is_important);
    // data.append("event[email_trigger_enabled]", formData.email_trigger_enabled);
    data.append("event[project_id]", selectedProjectId);

    // Append RSVP details if RSVP action is "yes"
    if (formData.rsvp_action === "yes") {
      data.append("event[rsvp_name]", formData.rsvp_name);
      data.append("event[rsvp_number]", formData.rsvp_number);
    }

    formData.attachfiles.forEach((file) => {
      if (file instanceof File) {
        data.append("event[attachfiles][]", file);
      }
    });

    try {
      // Make the POST request
      const response = await axios.post(
        `${BASE_URL}events.json`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from server:", response.data);
      
      toast.success("Event created successfully!", { duration: 3500 });
      setFormData({
        event_type: "",
        event_name: "",
        event_at: "",
        from_time: "",
        to_time: "",
        rsvp_action: "",
        description: "",
        publish: "",
        user_id: "",
        comment: "",
        shared: "",
        share_groups: "",
        attachfiles: [],
        attachfile: [],
        is_important: "",
        email_trigger_enabled: "",
      });
      setSelectedProjectId("");

      setTimeout(() => {
        navigate("/event-list");
      }, 600);
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (error.response && error.response.data) {
        toast.error(
          `Error: ${error.response.data.message || "Submission failed"}`
        );
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      // const token = "RnPRz2AhXvnFIrbcRZKpJqA8aqMAP_JEraLesGnu43Q"; // Replace with your actual token
      const url = `${BASE_URL}events.json`;

      try {
        const response = await axios.get(
          `${BASE_URL}events.json`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setEventType(response?.data?.events);
        // console.log("eventType", eventType);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}users/get_users.json`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setEventUserID(response?.data.users || []);
        // console.log("User", response)
        // console.log("eventUserID", eventUserID);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}projects.json`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error(
          "Error fetching projects:",
          error.response?.data || error.message
        );
      }
    };

    fetchProjects();
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid">
            <div className="module-data-section p-3">
              <EventBackToListButton />
              <form onSubmit={handleSubmit} noValidate>
                <div className="card mt-2 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title">Create Event</h3>
                </div>

                <div className="card-body">
                  {error && <p className="text-danger">{error}</p>}
                  <div className="row">
                    <div className="col-md-3 mt-1">
                      <div className="form-group">
                        <label>
                          Project
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <SelectBox
                          options={projects.map((proj) => ({
                            value: proj.id,
                            label: proj.project_name,
                          }))}
                          value={selectedProjectId || ""} // Ensure it's controlled
                          onChange={(value) => setSelectedProjectId(value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Event Type
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <select
                          className="form-control"
                          name="event_type"
                          value={formData.event_type || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select Event Type</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="lifestyle">Lifestyle</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Event Name
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="event_name"
                          placeholder="Enter Event Name"
                          value={formData.event_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Event At
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="event_at"
                          placeholder="Enter Event At"
                          value={formData.event_at}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Event From
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="datetime-local"
                          name="from_time"
                          placeholder="Enter Event From"
                          value={formData.from_time}
                          max={getNowLocal()}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Event To
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="datetime-local"
                          name="to_time"
                          placeholder="Enter Event To"
                          value={formData.to_time}
                          max={getNowLocal()}
                          min={formData.from_time}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-3">
                      <div className="form-group">
                        <label>Event Time</label>
                        <input
                          className="form-control"
                          type="time"
                          name="SFDC_Project_Id"
                          placeholder="Enter Event Time"
                          value=""
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          RSVP Action
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <div className="d-flex">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="rsvp_action"
                              value="yes"
                              checked={formData.rsvp_action === "yes"}
                              onChange={handleChange}
                              required
                            />
                            <label className="form-check-label">Yes</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="rsvp_action"
                              value="no"
                              checked={formData.rsvp_action === "no"}
                              onChange={handleChange}
                              required
                            />
                            <label className="form-check-label">No</label>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          RSVP Action
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <div className="d-flex">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="rsvp_action"
                              value="yes"
                              checked={formData.rsvp_action === "yes"}
                              onChange={handleChange}
                              required
                            />
                            <label className="form-check-label">Yes</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="rsvp_action"
                              value="no"
                              checked={formData.rsvp_action === "no"}
                              onChange={handleChange}
                              required
                            />
                            <label className="form-check-label">No</label>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    {/* Conditionally render fields when 'Yes' is selected */}
                    {formData.rsvp_action === "yes" && (
                      <>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>RSVP Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter RSVP Name"
                              name="rsvp_name"
                              value={formData.rsvp_name || ""}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>RSVP Number</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter RSVP Number"
                              name="rsvp_number"
                              value={formData.rsvp_number || ""}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* <div className="col-md-3">
                      <div className="form-group">
                        <label>Event Delete</label>
                        <input
                          className="form-control"
                          type="text"
                          name="SFDC_Project_Id"
                          placeholder="Enter Delete"
                          value=""
                        />
                      </div>
                    </div> */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Event Description
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={1}
                          name="description"
                          placeholder="Enter Description"
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      {/* <div className="form-group">
                        <label>
                          Event Publish
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <div className="d-flex">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="publish"
                              value="1"
                              checked={parseInt(formData.publish) === 1} // Convert to number for proper comparison
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  publish: parseInt(e.target.value), // Ensure value is stored as number
                                }))
                              }
                              required
                            />
                            <label className="form-check-label">Yes</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="publish"
                              value="0"
                              checked={parseInt(formData.publish) === 0} // Convert to number for proper comparison
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  publish: parseInt(e.target.value), // Ensure value is stored as number
                                }))
                              }
                              required
                            />
                            <label className="form-check-label">No</label>
                          </div>
                        </div>
                      </div> */}
                    </div>

                    <div className="col-md-3">
                      {/* <div className="form-group">
                        <label>
                          Event User ID
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <SelectBox
                          options={eventUserID?.map((user) => ({
                            value: user.id, // Ensure we use user.id instead of full name
                            label: `${user.firstname} ${user.lastname}`, // Display full name but store ID
                          }))}
                          value={formData.user_id || ""} // Ensure the correct user_id is preselected
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              user_id: value, // Store user.id instead of full name
                            }))
                          }
                        />
                      </div> */}
                    </div>

                    <div className="col-md-3">
                      {/* <div className="form-group">
                        <label>
                          Event Comment
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={1}
                          name="comment"
                          placeholder="Enter Comment"
                          value={formData.comment}
                          onChange={handleChange}
                          required
                        />
                      </div> */}
                    </div>
                    <div className="col-md-3">
                      {/* <div className="form-group">
                        <label>
                          Event Shared
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          required
                          name="shared"
                          placeholder="Enter Event Shared"
                          value={formData.shared}
                          onChange={handleChange}
                        />
                      </div> */}
                    </div>
                    <div className="col-md-3">
                      {/* <div className="form-group">
                        <label>
                          Event Share Groups
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          required
                          name="share_groups"
                          placeholder="Enter Shared Groups"
                          value={formData.share_groups}
                          onChange={handleChange}
                        />
                      </div> */}
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Event Images
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
                          <span />
                        </label>
                        <input
                          className="form-control mb-2"
                          type="file"
                          name="attachfiles"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                        {formData.attachfiles && formData.attachfiles.length > 0 && (
                          <div className="mt-2">
                            <strong>Selected Images:</strong>
                            <ul style={{listStyle: 'none', paddingLeft: 0}}>
                              {formData.attachfiles.map((file, idx) => (
                                <li key={idx} style={{marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                  <span>{file.name}</span>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    style={{fontSize: '12px', padding: '2px 6px', marginLeft: '8px'}}
                                    onClick={() => removeImage(idx)}
                                    title="Remove image"
                                  >
                                    ×
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      {/* <div className="form-group">
                        <label>Event is Important</label>
                        <div className="d-flex">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_important"
                              value="true"
                              checked={formData.is_important === true} // Ensure boolean comparison
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  is_important: true, // Store as boolean
                                }))
                              }
                            />
                            <label className="form-check-label">Yes</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_important"
                              value="false"
                              checked={formData.is_important === false} // Ensure boolean comparison
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  is_important: false, // Store as boolean
                                }))
                              }
                            />
                            <label className="form-check-label">No</label>
                          </div>
                        </div>
                      </div> */}
                    </div>

                    <div className="col-md-3">
                      {/* <div className="form-group">
                        <label>Event Email Trigger Enabled</label>
                        <div className="d-flex">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="email_trigger_enabled"
                              value="true"
                              checked={
                                formData.email_trigger_enabled === "true"
                              }
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email_trigger_enabled: e.target.value, // Store "true" as string
                                }))
                              }
                              required
                            />
                            <label className="form-check-label">Yes</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="email_trigger_enabled"
                              value="false"
                              checked={
                                formData.email_trigger_enabled === "false"
                              }
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email_trigger_enabled: e.target.value, // Store "false" as string
                                }))
                              }
                              required
                            />
                            <label className="form-check-label">No</label>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-center">
                <div className="col-md-2">
                  <button
                    type="submit"
                    className="purple-btn2 w-100 d-inline-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="purple-btn2 w-100"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCreate;
