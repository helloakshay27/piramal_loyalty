import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import GophygitalLogo1 from "/GophygitalLogo1.svg";
import LockatedLogo from "/LockatedLogo.png";
import EventBackToListButton from "../components/EventBackToListButton";
import SelectBox from "../components/base/SelectBox";
import BASE_URL from "../Confi/baseurl";

const normalizeApiString = (v) => {
  if (v == null) return "";
  if (typeof v !== "string") return String(v);
  const t = v.trim();
  return t === "NA" ? "" : v;
};

const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    attachfiles: [], // changed from attachfile to attachfiles for consistency
    previewImage: "",
    is_important: "false",
    email_trigger_enabled: "false",
  });

  const [eventType, setEventType] = useState([]);
  const [eventUserID, setEventUserID] = useState([]);
  const [loading, setLoading] = useState(false);
  /** True until event GET completes — hides empty form before data arrives. */
  const [eventLoading, setEventLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setEventLoading(false);
      return;
    }

    let cancelled = false;

    const processImageArray = (imageArray) => {
      if (!imageArray || !Array.isArray(imageArray)) return [];

      return imageArray.map((img) => ({
        id: img.id,
        name: img.document_file_name,
        document_file_name: img.document_file_name,
        document_url: img.document_url,
        preview: img.document_url,
        size: img.document_file_size / (1024 * 1024), // Convert to MB
        type: "image",
        isExisting: true, // Flag to identify existing images
        originalData: img,
      }));
    };

    const fetchEvent = async () => {
      setEventLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}events/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (cancelled) return;

        const {
          event_attachments,
          attachfiles_1_by_1,
          attachfiles_9_by_16,
          attachfiles_3_by_2,
          attachfiles_16_by_9,
          attachfiles,
          attachfile,
          ...apiData
        } = response.data;

        setFormData((prev) => ({
          ...prev,
          ...apiData,
          event_name: normalizeApiString(apiData.event_name),
          event_at: normalizeApiString(apiData.event_at),
          description: normalizeApiString(apiData.description),
          comment: normalizeApiString(apiData.comment),
          shared: normalizeApiString(apiData.shared),
          share_groups: normalizeApiString(apiData.share_groups),
          rsvp_name: normalizeApiString(apiData.rsvp_name),
          rsvp_number: normalizeApiString(apiData.rsvp_number),
          attachfiles: [
            ...processImageArray(event_attachments),
            ...processImageArray(attachfiles_1_by_1),
            ...processImageArray(attachfiles_16_by_9),
            ...processImageArray(attachfiles_9_by_16),
            ...processImageArray(attachfiles_3_by_2),
            ...processImageArray(attachfiles),
          ],
          previewImage: attachfile?.document_url || event_attachments?.[0]?.document_url || "",
        }));
      } catch (error) {
        console.error("Error fetching event:", error);
        if (!cancelled) {
          toast.error("Failed to load event.");
        }
      } finally {
        if (!cancelled) {
          setEventLoading(false);
        }
      }
    };

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const [projects, setProjects] = useState([]); // State to store projects

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}get_all_projects.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );


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
  //         "${BASE_URL}events.json",
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
          `${BASE_URL}users/get_users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
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

  const isBlankField = (v) => {
    const s = String(v ?? "").trim();
    return !s || s === "NA";
  };

  /** Use for controlled inputs — never show placeholder "NA" as a value. */
  const displayField = (v) => {
    if (v == null) return "";
    const s = String(v).trim();
    if (!s || s === "NA") return "";
    return String(v);
  };

  const hasValidEventMedia = (fd) => {
    const hasEventImages =
      Array.isArray(fd.attachfiles) &&
      fd.attachfiles.some((f) => f instanceof File || (f && f.isExisting));
    const hasPreview =
      fd.previewImage &&
      String(fd.previewImage).trim() !== "" &&
      String(fd.previewImage).trim() !== "NA";
    return hasEventImages || hasPreview;
  };

  /** First invalid field only (same order as the form, top to bottom). */
  const getFirstValidationError = (fd) => {
    if (!String(fd.project_id ?? "").trim()) return "Project is required.";
    if (!fd.event_type) return "Event type is required.";
    if (isBlankField(fd.event_name)) return "Event name is required.";
    if (isBlankField(fd.event_at)) return "Event at is required.";
    
    // Skip past checks if it's an existing event being edited, 
    // but the user might still want to prevent updating to past dates.
    // However, if the event was already in the past, we should allow it unless they change it.
    // For now, let's just stick to the basic from < to validation.
    
    if (!fd.from_time || isBlankField(fd.from_time)) return "Event from time is required.";
    if (!fd.to_time || isBlankField(fd.to_time)) return "Event to time is required.";

    const fromTimeStr = formatDateForInput(fd.from_time);
    const toTimeStr = formatDateForInput(fd.to_time);
    const nowLocal = getNowLocal();
    const todayLocal = getTodayLocal();

    if (fromTimeStr > nowLocal) return "Event from time cannot be in the future.";

    if (fromTimeStr && toTimeStr && fromTimeStr > toTimeStr) {
      return "Event to time must be after from time.";
    }
    if (fd.rsvp_action === "yes") {
      if (isBlankField(fd.rsvp_name)) return "RSVP name is required.";
      if (isBlankField(fd.rsvp_number)) return "RSVP number is required.";
    }
    if (isBlankField(fd.description)) return "Event description is required.";
    if (!hasValidEventMedia(fd)) return "At least one event image is required.";
    return null;
  };

  // Function to discard specific event image
  const discardEventImage = (fileToDiscard) => {
    setFormData((prevFormData) => {
      const updatedImages = prevFormData.attachfiles.filter(
        (file) => file !== fileToDiscard
      );

      return {
        ...prevFormData,
        attachfiles: updatedImages,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    const firstError = getFirstValidationError(formData);
    if (firstError) {
      toast.error(firstError);
      return;
    }

    setLoading(true);

    const data = new FormData();

    // List of keys to exclude from payload
    const excludeKeys = [
      "attachfiles",
      "attachfile", // Exclude the existing attachfile
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

    const validFiles = formData.attachfiles.filter((fileObj) => fileObj instanceof File);
    const hasFiles = validFiles.length > 0;
    validFiles.forEach((fileObj) => {
      data.append("event[attachfiles][]", fileObj);
    });

    // Debug FormData contents
    console.log("Form Data before submission:", formData);
    console.log("Has files to upload:", hasFiles);
    console.log("FormData entries:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    if (!hasFiles) {
      console.warn("No new files to upload, only updating text fields");
    }

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
      toast.success("Event updated successfully!", { duration: 3500 });
      setTimeout(() => {
        navigate("/event-list");
      }, 600);
    } catch (error) {
      console.error("Error updating event:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString || String(isoString).trim() === "NA") return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateOnly = (isoString) => {
    if (!isoString || String(isoString).trim() === "NA") return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const headerLogoSrc =
    typeof window !== "undefined" &&
    window.location.hostname === "rustomjee-loyalty.lockated.com"
      ? LockatedLogo
      : GophygitalLogo1;

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid">
            <div className="module-data-section p-3">
              <EventBackToListButton />
              {eventLoading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "55vh" }}
                >
                  <div className="text-center py-5" role="status" aria-live="polite">
                    <div className="spinner-border text-primary" aria-hidden="true" />
                    <p className="mt-3 mb-0 text-muted">Loading event…</p>
                  </div>
                </div>
              ) : (
              <form onSubmit={handleSubmit} noValidate>
              <div className="card mt-2 pb-4 mx-4">
                <div className="card-header py-3">
                  <div
                    className="d-flex flex-wrap align-items-center gap-3"
                    style={{ color: "#000" }}
                  >
                    <img
                      alt=""
                      className="go-logo my-1"
                      src={headerLogoSrc}
                      style={{ height: 44, width: "auto", objectFit: "contain" }}
                    />
                    <div>
                      <p className="small mb-1" style={{ color: "#334155" }}>
                        <span
                          role="button"
                          tabIndex={0}
                          className="pointer"
                          style={{ color: "#de7008", fontSize: "16px" }}
                          onClick={() => navigate("/event-list")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              navigate("/event-list");
                            }
                          }}
                        >
                          Events
                        </span>{" "}
                        <span style={{ fontSize: "16px" }}>&gt; Edit Event</span>
                      </p>
                      <h3 className="card-title mb-0" style={{ fontSize: "22px" }}>
                        Edit Event
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Project
                          <span style={{ color: "#de7008", fontSize: "16px" }}>
                            {" "}
                            *
                          </span>
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
                          value={displayField(formData.event_name)}
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
                          placeholder="Enter Event At"
                          value={displayField(formData.event_at)}
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
                          value={formatDateForInput(formData.from_time)}
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
                          value={formatDateForInput(formData.to_time)}
                          max={getNowLocal()}
                          min={formatDateForInput(formData.from_time)}
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
                          value={displayField(formData.description)}
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
                          value={displayField(formData.comment)}
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
                          value={displayField(formData.shared)}
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
                          value={displayField(formData.share_groups)}
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
                                    onClick={() =>
                                      file.isExisting
                                        ? discardEventImage(file)
                                        : removeImage(idx)
                                    }
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventEdit;
