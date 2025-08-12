import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SelectBox from "../components/base/SelectBox";
import BASE_URL from "../Confi/baseurl";
import ProjectImageVideoUpload from "../components/ProjectImageVideoUpload"

const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("id", id);

  const [formData, setFormData] = useState({
    project_id: "",
    event_type: "",
    event_name: "",
    event_at: "",
    from_time: "",
    to_time: "",
    rsvp_action: "",
    rsvp_name: "", 
    rsvp_number: "", 
    description: "",
    publish: "",
    user_id: "",
    comment: "",
    shared: "",
    share_groups: "",
    event_images: [], // changed from attachfile to event_images for consistency
    event_image_1_by_1: [],
    event_image_16_by_9: [],
    event_image_9_by_16: [],
    event_image_3_by_2: [],
    previewImage: "",
    is_important: "false",
    email_trigger_enabled: "false",
  });

  console.log("Data", formData);

  const [eventType, setEventType] = useState([]);
  const [eventUserID, setEventUserID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}events/${id}.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response?.data);
        setFormData((prev) => ({
          ...prev,
          ...response.data,
          event_images: [], // Reset file input
          previewImage: response?.data?.attachfile?.document_url || "", // Set existing image preview
        }));
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (id) fetchEvent();
    console.log("project_id: " + formData.project_id);
  }, [id]);

  const [projects, setProjects] = useState([]); // State to store projects

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/get_all_projects.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched Projects:", response.data);

        setProjects(response.data.projects || []); // Ensure data structure is correct
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // useEffect(() => {
  //   const fetchEventTypes = async () => {
  //     try {
  //       const response = await axios.get(
  //         "${BASE_URL}/events.json",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       setEventType(response.data.events);
  //     } catch (error) {
  //       console.error("Error fetching event types:", error);
  //     }
  //   };
  //   fetchEventTypes();
  // }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/get_users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },data
          }
        );
        setEventUserID(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

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

  // Remove preview image
  const removePreviewImage = () => {
    setFormData((prev) => ({
      ...prev,
      previewImage: "",
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "true", // Convert string to boolean
    }));
  };

  // Event images configuration for different ratios
  const event_images = [
    { key: "event_image_1_by_1", label: "1:1" },
    { key: "event_image_16_by_9", label: "16:9" },
    { key: "event_image_9_by_16", label: "9:16" },
    { key: "event_image_3_by_2", label: "3:2" },
  ];

  const selectedRatios = ["1:1", "16:9", "9:16", "3:2"];
  const dynamicLabel = "Event Images";
  const dynamicDescription = "Upload images for the event with different aspect ratios";

  // Handle crop complete from ProjectImageVideoUpload
  const handleCropComplete = (fileAndRatios) => {
    const formDataCopy = { ...formData };

    fileAndRatios.forEach(({ file, ratio }) => {
      // Ensure the file object has proper structure
      const fileObject = {
        ...file,
        ratio,
        name: file.name || file.file?.name || `Image_${Date.now()}`,
        preview: file.preview || file.base64 || (file.file && URL.createObjectURL(file.file))
      };

      if (ratio === "1:1") {
        formDataCopy.event_image_1_by_1 = [
          ...formDataCopy.event_image_1_by_1,
          fileObject,
        ];
      } else if (ratio === "16:9") {
        formDataCopy.event_image_16_by_9 = [
          ...formDataCopy.event_image_16_by_9,
          fileObject,
        ];
      } else if (ratio === "9:16") {
        formDataCopy.event_image_9_by_16 = [
          ...formDataCopy.event_image_9_by_16,
          fileObject,
        ];
      } else if (ratio === "3:2") {
        formDataCopy.event_image_3_by_2 = [
          ...formDataCopy.event_image_3_by_2,
          fileObject,
        ];
      }
    });

    // Also add to event_images array for backward compatibility
    formDataCopy.event_images = [
      ...formDataCopy.event_images,
      ...fileAndRatios.map(({ file }) => file.file || file),
    ];

    setFormData(formDataCopy);
    setShowUploader(false);
  };

  // Function to discard specific event image
  const discardEventImage = (key, fileToDiscard) => {
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };
      
      // Remove from specific ratio array
      if (Array.isArray(updatedFormData[key])) {
        updatedFormData[key] = updatedFormData[key].filter(
          (file) => file !== fileToDiscard
        );
      }
      
      // Also remove from general event_images array for backward compatibility
      updatedFormData.event_images = updatedFormData.event_images.filter(
        (file) => file !== fileToDiscard
      );
      
      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    // List of keys to exclude from payload
    const excludeKeys = [
      "event_images",
      "event_image_1_by_1",
      "event_image_16_by_9", 
      "event_image_9_by_16",
      "event_image_3_by_2",
      "reminders",
      "id",
      "is_delete",
      "canceled_by",
      "canceler_id",
      "resource_id",
      "resource_type",
      "active",
      "created_at",
      "updated_at",
      "project_name",
      "url",
      "interested",
      "current_user_interested",
      "previewImage"
    ];

    // Append only allowed fields
    Object.keys(formData).forEach((key) => {
      if (excludeKeys.includes(key)) return;
      data.append(`event[${key}]`, formData[key]);
    });

    // Handle image uploads - support both legacy and ratio-specific arrays
    if (formData.event_images && formData.event_images.length > 0) {
      formData.event_images.forEach((file) => {
        if (file instanceof File) {
          data.append("event[event_images][]", file);
        }
      });
    }

    // Handle ratio-specific images
    ["event_image_1_by_1", "event_image_16_by_9", "event_image_9_by_16", "event_image_3_by_2"].forEach((ratioKey) => {
      if (formData[ratioKey] && formData[ratioKey].length > 0) {
        formData[ratioKey].forEach((fileObj) => {
          if (fileObj instanceof File) {
            data.append(`event[${ratioKey}][]`, fileObj);
          } else if (fileObj.file instanceof File) {
            data.append(`event[${ratioKey}][]`, fileObj.file);
          }
        });
      }
    });

    // Append RSVP fields if RSVP action is "yes"
    // if (formData.rsvp_action === "yes") {
    //   data.append("event[rsvp_name]", formData.rsvp_name || "");
    //   data.append("event[rsvp_number]", formData.rsvp_number || "");
    // }

    try {
      await axios.put(
        `${BASE_URL}events/${id}.json`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Event updated successfully!");
      navigate("/event-list");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };
  

  const formatDateForInput = (isoString) => {
    if (!isoString) return ""; // Handle empty values
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16); // Extract "YYYY-MM-DDTHH:MM"
  };

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
                  <h3 className="card-title">Edit Event</h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Project
                          {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span> */}
                        </label>
                        <SelectBox
                          options={projects.map((project) => ({
                            value: project.id, // Ensure this matches API response field
                            label: project.project_name, // Ensure correct field name
                          }))}
                          defaultValue={formData.project_id || ""}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              project_id: value,
                            }))
                          }
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
                          value={formData.event_name || "NA"}
                          onChange={handleChange}
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
                          value={formData.event_at || "NA"}
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
                          value={formatDateForInput(formData.from_time) || "NA"}
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
                          value={formatDateForInput(formData.to_time) || "NA"}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

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

                    {/* Show RSVP Name and RSVP Number only if RSVP Action is "yes" */}
                    {/* {formData.rsvp_action === "yes" && (
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
                            />
                          </div>
                        </div>
                      </>
                    )} */}

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
                          placeholder="Enter Project Description"
                          value={formData.description || "NA"}
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
                              checked={parseInt(formData.publish) === 1} // Ensure correct value selection
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  publish: parseInt(e.target.value), // Store as number
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
                              checked={parseInt(formData.publish) === 0} // Ensure correct value selection
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  publish: parseInt(e.target.value), // Store as number
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
                            value: user.id, // Store user.id instead of full name
                            label: `${user.firstname} ${user.lastname}`, // Display full name
                          }))}
                          defaultValue={formData.user_id || ""} // Ensure the correct user_id is preselected
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
                          placeholder="Enter Project Description"
                          value={formData.comment || "NA"}
                          onChange={handleChange}
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
                          name="shared"
                          placeholder="Enter Event Shared"
                          value={formData.shared || "NA"}
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
                          name="share_groups"
                          placeholder="Enter Shared Groups"
                          value={formData.share_groups || "NA"}
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

                        {/* Image Preview */}
                        {formData.previewImage && (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                              src={formData.previewImage}
                              alt="Uploaded Preview"
                              className="img-fluid rounded mt-2"
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                fontSize: '12px',
                                padding: '2px 6px',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onClick={removePreviewImage}
                              title="Remove preview image"
                            >
                              ×
                            </button>
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
                                // Handle different file object structures
                                const preview = file.preview || 
                                              file.document_url || 
                                              file.base64 || 
                                              (file.file && URL.createObjectURL(file.file)) ||
                                              (file instanceof File && URL.createObjectURL(file)) ||
                                              "";
                                              
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
                              checked={formData.is_important == true}
                              onChange={handleRadioChange}
                            />
                            <label className="form-check-label">Yes</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_important"
                              value="false"
                              checked={formData.is_important == false}
                              onChange={handleRadioChange}
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
                          {/* Yes Option */}
                          {/* <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="email_trigger_enabled"
                              value="true"
                              checked={formData.email_trigger_enabled === true} // Compare as boolean
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email_trigger_enabled:
                                    e.target.value === "true", // Convert to boolean
                                }))
                              }
                              required
                            />
                            <label className="form-check-label">Yes</label>
                          </div> */}

                          {/* No Option */}
                          {/* <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="email_trigger_enabled"
                              value="false"
                              checked={formData.email_trigger_enabled === false} // Compare as boolean
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email_trigger_enabled:
                                    e.target.value === "true", // Convert to boolean
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

export default EventEdit;
