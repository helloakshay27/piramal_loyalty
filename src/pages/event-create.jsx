import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SelectBox from "../components/base/SelectBox";
import BASE_URL from "../Confi/baseurl";
import ProjectImageVideoUpload from "../components/ProjectImageVideoUpload"; 

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
    event_images: [], // renamed for clarity and matches API
    event_image_1_by_1: [],
    event_image_16_by_9: [],
    event_image_9_by_16: [],
    event_image_3_by_2: [],
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [showUploader, setShowUploader] = useState(false);


  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      event_images: [...prevFormData.event_images, ...validFiles],
    }));
  };

  // Remove individual image
  const removeImage = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      event_images: prevFormData.event_images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Event image ratios configuration
  const event_images = [
    { key: "event_image_1_by_1", label: "1:1" },
    { key: "event_image_16_by_9", label: "16:9" },
    { key: "event_image_9_by_16", label: "9:16" },
    { key: "event_image_3_by_2", label: "3:2" },
  ];

  const eventUploadConfig = {
    "Event Images": ["1:1", "9:16", "16:9", "3:2"],
  };

  const currentUploadType = "Event Images";
  const selectedRatios = eventUploadConfig[currentUploadType] || [];
  const dynamicLabel = currentUploadType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicDescription = `Supports ${selectedRatios.join(", ")} aspect ratios`;

  const updateFormData = (key, files) => {
    setFormData((prev) => ({
      ...prev,
      [key]: files, // Replace existing files instead of appending
    }));
  };

  const handleCropComplete = (validImages, videoFiles = []) => {
    // Handle video files first
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((video) => {
        const formattedRatio = video.ratio.replace(":", "_by_");
        const key = `event_image_${formattedRatio}`;
        
        // Safely create preview URL for video
        let previewUrl = null;
        if (video.preview) {
          previewUrl = video.preview;
        } else if (video.base64) {
          previewUrl = video.base64;
        } else if (video.file instanceof File) {
          previewUrl = URL.createObjectURL(video.file);
        }
        
        const videoObject = {
          ...video,
          name: video.name || video.file?.name || `Video_${Date.now()}`,
          preview: previewUrl
        };
        
        updateFormData(key, [videoObject]);
      });
      setShowUploader(false);
      return;
    }

    // Handle images
    if (!validImages || validImages.length === 0) {
      toast.error("No valid files selected.");
      setShowUploader(false);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      const key = `event_image_${formattedRatio}`;
      
      console.log('Processing image for ratio:', formattedRatio, img);
      console.log('Image has file property:', img.file instanceof File);
      
      // The image object from ProjectImageVideoUpload already has the correct structure
      // Just update the formData directly with the image object as-is
      updateFormData(key, [img]);
    });

    setShowUploader(false);
  };

  const discardEventImage = (key, imageToRemove) => {
    setFormData((prev) => {
      const updatedArray = (prev[key] || []).filter(
        (img) => img !== imageToRemove // Remove the exact object reference instead of comparing by id
      );

      const newFormData = { ...prev };
      if (updatedArray.length === 0) {
        delete newFormData[key];
      } else {
        newFormData[key] = updatedArray;
      }

      return newFormData;
    });
  };

  useEffect(() => {
    // console.log("Updated event_images:", formData.event_images);
  }, [formData.event_images]);

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the state with the radio button's value
    }));
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

  const validateForm = (formData) => {
    const errors = [];

    // Only validate fields that are visible/active in the form
    if (!formData.event_name) {
      errors.push("Event Name is required.");
      return errors;
    }
    if (!formData.event_at) {
      errors.push("Event At is required.");
      return errors;
    }
    if (!formData.from_time) {
      errors.push("Event from time is required.");
      return errors;
    }
    if (!formData.to_time) {
      errors.push("Event to Time is required.");
      return errors;
    }
    if (!formData.rsvp_action) {
      errors.push("RSVP action is required.");
      return errors;
    }
    if (formData.rsvp_action === "yes") {
      if (!formData.rsvp_name) {
        errors.push("RSVP Name is required.");
      }
      if (!formData.rsvp_number) {
        errors.push("RSVP Number is required.");
      }
    }
    if (!formData.description) {
      errors.push("Event description is required.");
      return errors;
    }
    // File validation (images must be present)
    if (!formData.event_images || formData.event_images.length === 0) {
      errors.push("At least one image is required.");
      return errors;
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    // Validate form data
    // const validationErrors = validateForm(formData);
    // if (validationErrors.length > 0) {
    //   validationErrors.forEach((error) => toast.error(error));
    //   setLoading(false);
    //   return;
    // }

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

    // Handle ratio-specific images with correct field names
    const imageFieldMapping = {
      "event_image_1_by_1": "event_images_1_by_1",
      "event_image_16_by_9": "event_images_16_by_9",
      "event_image_9_by_16": "event_images_9_by_16",
      "event_image_3_by_2": "event_images_3_by_2"
    };

    console.log("Form data before payload creation:", formData);

    let hasImageFiles = false;
    Object.keys(imageFieldMapping).forEach((formKey) => {
      const payloadKey = imageFieldMapping[formKey];
      console.log(`Checking ${formKey}:`, formData[formKey]);
      
      if (formData[formKey] && Array.isArray(formData[formKey]) && formData[formKey].length > 0) {
        formData[formKey].forEach((img, index) => {
          console.log(`Processing image ${index} in ${formKey}:`, img);
          console.log(`Image structure:`, {
            isFile: img instanceof File,
            hasFileProperty: img.file instanceof File,
            fileName: img.name || img.file?.name,
            fileSize: img.file?.size,
          });
          
          if (img.file instanceof File) {
            data.append(`event[${payloadKey}][]`, img.file);
            hasImageFiles = true;
            console.log(`Added file to payload: ${payloadKey}`, img.file.name);
          } else if (img instanceof File) {
            data.append(`event[${payloadKey}][]`, img);
            hasImageFiles = true;
            console.log(`Added direct file to payload: ${payloadKey}`, img.name);
          } else {
            console.warn(`Invalid file object in ${formKey}:`, img);
            console.warn(`Expected File object but got:`, typeof img, img);
          }
        });
      } else {
        console.log(`No files in ${formKey} or not an array`);
      }
    });

    // Legacy support for old event_images array
    if (formData.event_images && formData.event_images.length > 0) {
      formData.event_images.forEach((file) => {
        if (file instanceof File) {
          data.append("event[event_images][]", file);
          hasImageFiles = true;
          console.log("Added legacy image:", file.name);
        } else {
          console.warn("Invalid file detected:", file);
        }
      });
    }

    console.log("Has image files to upload:", hasImageFiles);

    // Debug FormData contents
    console.log("FormData entries:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

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
      
      toast.success("Event created successfully!");
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
        attachfile: [],
        is_important: "",
        email_trigger_enabled: "",
      });

      navigate("/event-list");
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
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title">Create Event</h3>
                </div>

                <div className="card-body">
                  {error && <p className="text-danger">{error}</p>}
                  <div className="row">
                    <div className="col-md-3 mt-1">
                      <div className="form-group">
                        <label>Project</label>
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
                          required
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
                          placeholder="Enter Evnet At"
                          value={formData.event_at}
                          required
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
                          placeholder="Enter Event From "
                          value={formData.from_time}
                          required
                          // min={new Date().toISOString().slice(0, 16)}
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
                          required
                          value={formData.to_time}
                          min={
                            formData.from_time ||
                            new Date().toISOString().slice(0, 16)
                          }
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
                          required
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
                          <span
                            className="tooltip-container"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            [i]
                            {showTooltip && (
                              <span className="tooltip-text">
                                Supports 1:1, 9:16, 16:9, 3:2 aspect ratios
                              </span>
                            )}
                          </span>
                          <span />
                        </label>
                        
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowUploader(true)}
                          className="custom-upload-button input-upload-button"
                          style={{
                            display: 'block',
                            padding: '8px 12px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <span className="upload-button-label">Choose Images</span>
                        </span>

                        {showUploader && (
                          <ProjectImageVideoUpload
                            onClose={() => setShowUploader(false)}
                            includeInvalidRatios={false}
                            selectedRatioProp={selectedRatios}
                            showAsModal={true}
                            label={dynamicLabel}
                            description={dynamicDescription}
                            onContinue={handleCropComplete}
                            allowVideos={false}
                          />
                        )}

                        {/* Legacy file input for backward compatibility */}
                        <input
                          className="form-control mb-2"
                          type="file"
                          name="event_images"
                          accept="image/*"
                          multiple={false}
                          onChange={handleImageChange}
                          id="event-image-input"
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm mb-2"
                          onClick={() => document.getElementById('event-image-input').click()}
                          style={{ display: 'none' }}
                        >
                          Add Image (Legacy)
                        </button>
                        {formData.event_images && formData.event_images.length > 0 && (
                          <div className="mt-2">
                            <strong>Legacy Images:</strong>
                            <ul style={{listStyle: 'none', paddingLeft: 0}}>
                              {formData.event_images.map((file, idx) => (
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

                    {/* Event Images Table */}
                    <div className="col-md-12 mt-4">
                      <div className="scrollable-table tbl-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>File Name</th>
                              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Preview</th>
                              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Ratio</th>
                              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event_images.map(({ key, label }) => {
                              const files = Array.isArray(formData[key])
                                ? formData[key]
                                : formData[key]
                                ? [formData[key]]
                                : [];

                              return files.map((file, index) => {
                                // Handle different file object structures safely
                                let preview = "";
                                
                                if (file.preview) {
                                  preview = file.preview;
                                } else if (file.document_url) {
                                  preview = file.document_url;
                                } else if (file.base64) {
                                  preview = file.base64;
                                } else if (file.file instanceof File) {
                                  try {
                                    preview = URL.createObjectURL(file.file);
                                  } catch (error) {
                                    console.warn('Failed to create object URL for file.file:', file.file, error);
                                  }
                                } else if (file instanceof File) {
                                  try {
                                    preview = URL.createObjectURL(file);
                                  } catch (error) {
                                    console.warn('Failed to create object URL for file:', file, error);
                                  }
                                }
                                                            
                                const name = file.name || 
                                           file.document_file_name || 
                                           (file.file && file.file.name) ||
                                           `Image_${index + 1}`;

                                return (
                                  <tr key={`${key}-${index}`}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{name}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                      {preview && (
                                        <img
                                          style={{ maxWidth: 100, maxHeight: 100 }}
                                          className="img-fluid rounded"
                                          src={preview}
                                          alt={name}
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{file.ratio || label}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => discardEventImage(key, file)}
                                        title="Remove image"
                                      >
                                        ×
                                      </button>
                                    </td>
                                  </tr>
                                );
                              });
                            })}
                          </tbody>
                        </table>
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
                    onClick={handleSubmit}
                    type="submit"
                    className="purple-btn2 w-100"
                    disabled={loading}
                  >
                    Submit
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCreate;
