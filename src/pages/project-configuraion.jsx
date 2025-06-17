import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectBox from "../components/base/SingleSelect";
import axios from "axios";
import { toast } from "react-hot-toast";
import BASE_URL from "../Confi/baseurl"; 

const ProjectConfiguration = () => {
  const [iconPreview, setIconPreview] = useState(null); // ✅ Holds icon preview
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    active: "1", // ✅ Default: Active
    icon: null, // ✅ New: Track icon separately
  });

  // Handle Icon Change
  const handleIconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        icon: file, // ✅ Save the selected file
      }));
      setIconPreview(URL.createObjectURL(file));
    }
  };

  // Remove Icon
  const handleRemoveIcon = () => {
    setFormData((prevData) => ({
      ...prevData,
      icon: null,
    }));
    setIconPreview(null);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.icon) {
      toast.error("Icon is required");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("configuration_setup[name]", formData.name);
    formDataToSend.append("configuration_setup[active]", formData.active);
    formDataToSend.append("configuration_setup[icon]", formData.icon);

    try {
      const response = await axios.post(
        `${BASE_URL}/configuration_setups.json`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Project configuration created successfully!");
      navigate("/setup-member/project-configuration-list");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid">
            <form onSubmit={handleSubmit}>
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title">Project Configuration</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* Name Field */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Name <span style={{ color: "#de7008" }}> *</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter Name"
                        />
                      </div>
                    </div>

                    {/* Active Status */}
                    {/* <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Status <span style={{ color: "#de7008" }}> *</span>
                        </label>
                        <select
                          className="form-control"
                          name="active"
                          value={formData.active}
                          onChange={handleInputChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                    </div> */}

                    {/* Icon Upload */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Icon
                          <span
                            className="tooltip-container"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            [i]
                            {showTooltip && (
                              <span className="tooltip-text">
                                Max Upload Size 10 MB
                              </span>
                            )}
                          </span>{" "}
                          <span style={{ color: "#de7008" }}> *</span>
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          name="icon"
                          onChange={handleIconChange} // ✅ Handles only icon upload
                        />
                      </div>
                    </div>

                    {/* Icon Preview */}
                    {iconPreview && (
                      <div className="col-md-3 mt-2">
                        <label>Preview:</label>
                        <div className="position-relative">
                          <img
                            src={iconPreview}
                            alt="Icon Preview"
                            className="img-thumbnail"
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            className="position-absolute border-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              top: 2,
                              right: -5,
                              height: 20,
                              width: 20,
                              backgroundColor: "var(--red)",
                              color: "white",
                            }}
                            onClick={handleRemoveIcon}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="row mt-2 justify-content-center">
                <div className="col-md-2">
                  <button
                    type="submit"
                    className="purple-btn2 w-100"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="purple-btn2 w-100"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectConfiguration;
