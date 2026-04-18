import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import EventBackToListButton from "../components/EventBackToListButton";
import BASE_URL from "../Confi/baseurl";

const RATIO_IMAGE_KEYS = [
  { key: "event_images_1_by_1", label: "1 : 1" },
  { key: "event_images_9_by_16", label: "9 : 16" },
  { key: "event_images_16_by_9", label: "16 : 9" },
  { key: "event_images_3_by_2", label: "3 : 2" },
];

const formatDateTime = (value) => {
  if (value == null || value === "") return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
};

const DetailRow = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-12 mb-3" : "col-md-6 mb-3"}>
    <div className="row g-2 align-items-baseline">
      <div className="col-sm-4 col-md-3 text-muted small fw-semibold">{label}</div>
      <div className="col-sm-8 col-md-9 text-break">
        <span className="text-dark">{value ?? "—"}</span>
      </div>
    </div>
  </div>
);

const EventDetails = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const eventId = id;

  useEffect(() => {
    if (!eventId) {
      setEventData(null);
      return;
    }

    const fetchEventData = async () => {
      setLoadError(null);
      try {
        const response = await axios.get(`${BASE_URL}events/${eventId}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setEventData(response.data);
      } catch (error) {
        console.error("Error fetching event data", error);
        setLoadError("Could not load event.");
        setEventData(null);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (loadError) {
    return (
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid">
            <div className="module-data-section p-3">
              <EventBackToListButton />
              <p className="text-danger mx-4 mt-2">{loadError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid">
            <div className="module-data-section p-3">
              <EventBackToListButton />
              <div
                className="d-flex justify-content-center align-items-center p-5"
                style={{ minHeight: "45vh" }}
              >
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status" aria-hidden="true" />
                  <p className="mt-2 text-muted mb-0">Loading event…</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ratioBlocks = RATIO_IMAGE_KEYS.map(({ key, label }) => {
    const arr = eventData[key];
    const list = Array.isArray(arr) ? arr : [];
    if (list.length === 0) return null;
    return (
      <div key={key} className="col-md-6 col-lg-4 mb-4">
        <div className="small text-muted fw-semibold mb-2">{label}</div>
        <div className="d-flex flex-column gap-2">
          {list.map((doc) => (
            <div
              key={doc.id ?? doc.document_url}
              className="border rounded p-2 bg-light text-center"
            >
              {doc.document_url ? (
                <img
                  src={doc.document_url}
                  alt={doc.document_file_name || label}
                  className="img-fluid rounded"
                  style={{ maxHeight: 220, objectFit: "contain" }}
                />
              ) : (
                <span className="text-muted small">No preview URL</span>
              )}
              {doc.document_file_name && (
                <div className="small text-truncate mt-1" title={doc.document_file_name}>
                  {doc.document_file_name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }).filter(Boolean);

  const hasAttachfile = Boolean(eventData.attachfile?.document_url);
  const hasRatioImages = ratioBlocks.length > 0;

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid">
            <div className="module-data-section p-3">
              <EventBackToListButton />
              <div className="card mt-2 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title mb-0">Event Details</h3>
                </div>
                <div className="card-body">
                  <div className="row px-1 px-md-2">
                    <DetailRow label="Event Type" value={eventData.event_type || "—"} />
                    <DetailRow label="Event Name" value={eventData.event_name || "—"} />
                    <DetailRow label="Event At" value={eventData.event_at || "—"} />
                    <DetailRow label="Event From" value={formatDateTime(eventData.from_time)} />
                    <DetailRow label="Event To" value={formatDateTime(eventData.to_time)} />
                    {eventData.rsvp_action === "yes" && (
                      <>
                        <DetailRow label="RSVP Name" value={eventData.rsvp_name || "—"} />
                        <DetailRow label="RSVP Number" value={eventData.rsvp_number || "—"} />
                      </>
                    )}
                    <DetailRow
                      label="Event Publish"
                      value={
                        eventData.publish === 1 || eventData.publish === "1"
                          ? "Yes"
                          : eventData.publish === 0 || eventData.publish === "0"
                            ? "No"
                            : eventData.publish ?? "—"
                      }
                    />
                    {/* <DetailRow label="Event User ID" value={eventData.user_id ?? "—"} /> */}
                    <div className="col-12 mb-3">
                      <div className="row g-2 align-items-start">
                        <div className="col-sm-4 col-md-2 text-muted small fw-semibold">
                          Event Description
                        </div>
                        <div className="col-sm-8 col-md-10">
                          <p
                            className="mb-0 text-dark"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: isExpanded ? "unset" : 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              cursor: "pointer",
                            }}
                            onClick={() => setIsExpanded(!isExpanded)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setIsExpanded(!isExpanded);
                              }
                            }}
                          >
                            {eventData.description || "—"}
                            {!isExpanded && eventData.description && eventData.description.length > 120 && (
                              <span className="fw-semibold ms-1">… Show more</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mt-3 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title mb-0">Event images</h3>
                </div>
                <div className="card-body">
                  {hasAttachfile && (
                    <div className="mb-4">
                      <div className="small text-muted fw-semibold mb-2">Main attachment</div>
                      <div className="border rounded p-2 bg-light d-inline-block">
                        <img
                          src={eventData.attachfile.document_url}
                          alt="Event attachment"
                          className="img-fluid rounded"
                          style={{ maxHeight: 280, objectFit: "contain", display: "block" }}
                        />
                      </div>
                    </div>
                  )}
                  {hasRatioImages ? (
                    <div className="row">{ratioBlocks}</div>
                  ) : !hasAttachfile ? (
                    <p className="text-muted mb-0">No images for this event.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
