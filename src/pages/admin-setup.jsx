import React, { useEffect, useState } from "react";
import axios from "axios";

const API_GET = "https://piramal-loyalty-dev.lockated.com/organizations/admin_email_addreses.json";
const API_UPDATE = "https://piramal-loyalty-dev.lockated.com/organizations/update_admin_email_addreses.json";
const AUTH_TOKEN = "IJaTYymulKXmHNingzhAVd_SfS6g26ZO2ctfb06oxPA";

export default function AdminSetup() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalEmails, setModalEmails] = useState([""]);
  const [modalMode, setModalMode] = useState("edit"); // 'edit' or 'add'

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = () => {
    setLoading(true);
    axios
      .get(API_GET, {
        headers: {
          Accept: "application/json, text/plain, /",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      })
      .then((res) => {
        setEmails(res.data.admin_email_addresses || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch emails");
        setLoading(false);
      });
  };

  const openEditModal = () => {
    setModalMode("edit");
    setModalEmails(emails.length ? [...emails] : [""]);
    setShowModal(true);
    setSuccess("");
    setError("");
  };

  const openAddModal = () => {
    setModalMode("add");
    setModalEmails([""]);
    setShowModal(true);
    setSuccess("");
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSuccess("");
    setError("");
  };

  const handleModalChange = (idx, value) => {
    const updated = [...modalEmails];
    updated[idx] = value;
    setModalEmails(updated);
  };

  const addModalEmailField = () => setModalEmails([...modalEmails, ""]);
  const removeModalEmailField = (idx) => {
    if (modalEmails.length === 1) return;
    setModalEmails(modalEmails.filter((_, i) => i !== idx));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    // Merge existing emails with new ones for 'add' mode, or just use modalEmails for 'edit'
    let emailsToSubmit = [];
    if (modalMode === "add") {
      // Avoid duplicates
      const existing = emails || [];
      emailsToSubmit = Array.from(new Set([...existing, ...modalEmails.filter(Boolean)]));
    } else {
      emailsToSubmit = modalEmails.filter(Boolean);
    }
    axios
      .post(
        API_UPDATE,
        { admin_email_addresses: emailsToSubmit },
        {
          headers: {
            Accept: "application/json, text/plain, /",
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setSuccess("Emails updated successfully");
        setShowModal(false);
        fetchEmails();
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to update emails");
        setLoading(false);
      });
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <div className="module-data-section p-3">
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0">Admin Email List</h3>
                <div>
                  <button className="purple-btn2 btn-sm me-2" onClick={openEditModal}>
                    Edit
                  </button>
                  <button className="purple-btn2 btn-sm" onClick={openAddModal}>
                    Add
                  </button>
                </div>
              </div>
              <div className="card-body">
                {loading && <p>Loading...</p>}
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
                <div className="row">
                  <div className="col-md-8">
                    <label className="form-label mb-2" style={{ fontWeight: 600 }}>
                      Admin Email Addresses
                    </label>
                    <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                      {emails.length === 0 ? (
                        <li className="text-muted">No admin emails found.</li>
                      ) : (
                        emails.map((email, idx) => (
                          <li key={idx} className="mb-2" style={{ fontSize: '16px' }}>
                            <span className="me-2">{email}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === 'edit' ? 'Edit Admin Emails' : 'Add Admin Emails'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleModalSubmit}>
                <div className="modal-body">
                  {modalEmails.map((email, idx) => (
                    <div className="form-group d-flex align-items-center mb-2" key={idx}>
                      <input
                        type="email"
                        className="form-control me-2"
                        value={email}
                        onChange={(e) => handleModalChange(idx, e.target.value)}
                        required
                        placeholder="Enter admin email"
                        style={{ height: '38px' }}
                      />
                      <button
                        type="button"
                        className="purple-btn2 btn-sm"
                        onClick={() => removeModalEmailField(idx)}
                        disabled={modalEmails.length === 1}
                        style={{ minWidth: '80px' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="purple-btn2 btn-sm mb-3"
                    style={{ minWidth: '110px' }}
                    onClick={addModalEmailField}
                  >
                    Add Email
                  </button>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="purple-btn2 w-100" disabled={loading}>
                    {modalMode === 'edit' ? 'Update Emails' : 'Add Emails'}
                  </button>
                  <button type="button" className="purple-btn2 w-100" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
