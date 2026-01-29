import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Confi/baseurl";

function EncashDetails() {
  const { id } = useParams();
  const [encash, setEncash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const fetchEncash = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${BASE_URL}encash_requests/${id}.json`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEncash(response.data.encash_request || response.data);
    } catch (err) {
      setError("Failed to fetch encash details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncash();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="w-100">
      <div className="module-data-section mt-2 mb-2">
        <p className="pointer">
          <span>Encash</span> &gt; Encash Details
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : encash ? (
          <>
            <div className="go-shadow mx-3 no-top-left-shadow ">
              <h5 className="d-flex">
                <span className="title mt-3">ENCASH REQUEST DETAILS</span>
              </h5>
              <div className="row px-3">
                <div className="col-lg-8 col-md-12 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Request ID</div>
                  <div className="col-6 p-1 member-detail-color">: {encash.id}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Person Name</div>
                  <div className="col-6 p-1 member-detail-color">: {encash.person_name}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Points to Encash</div>
                  <div className="col-6 p-1 member-detail-color">: {encash.points_to_encash?.toLocaleString()}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Facilitation Fee</div>
                  <div className="col-6 p-1 member-detail-color">: {formatCurrency(encash.facilitation_fee)}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Amount Payable</div>
                  <div className="col-6 p-1 member-detail-color">: {formatCurrency(encash.amount_payable)}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Status</div>
                  <div className="col-6 p-1 member-detail-color">: {encash.status}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Created At</div>
                  <div className="col-6 p-1 member-detail-color">: {formatDate(encash.created_at)}</div>
                </div>
              </div>
            </div>
            <div className="go-shadow mx-3 no-top-left-shadow mt-4">
              <h5 className="d-flex">
                <span className="title mt-3">BANK & TRANSACTION DETAILS</span>
              </h5>
              <div className="row px-3">
                <div className="col-6 p-1 text-muted member-detail-color">Account Number</div>
                <div className="col-6 p-1 member-detail-color">: {encash.account_number}</div>
                <div className="col-6 p-1 text-muted member-detail-color">IFSC Code</div>
                <div className="col-6 p-1 member-detail-color">: {encash.ifsc_code}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Branch</div>
                <div className="col-6 p-1 member-detail-color">: {encash.branch_name}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Transaction Mode</div>
                <div className="col-6 p-1 member-detail-color">: {encash.transaction_mode || '-'}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Transaction Number</div>
                <div className="col-6 p-1 member-detail-color">: {encash.transaction_number || '-'}</div>
              </div>
            </div>
            <div className="go-shadow mx-3 no-top-left-shadow mt-4">
              <h5 className="d-flex">
                <span className="title mt-3">REFERRAL & BOOKING</span>
              </h5>
              <div className="row px-3">
                <div className="col-6 p-1 text-muted member-detail-color">Referral Name</div>
                <div className="col-6 p-1 member-detail-color">: {encash.referral_name || '-'}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Application Value</div>
                <div className="col-6 p-1 member-detail-color">: {encash.application_value !== undefined ? Number(encash.application_value).toLocaleString() : '-'}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Brokerage %</div>
                <div className="col-6 p-1 member-detail-color">: {encash.brokerage_percentages !== undefined && encash.brokerage_percentages !== null ? `${encash.brokerage_percentages} %` : '-'}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Booking Unit</div>
                <div className="col-6 p-1 member-detail-color">: {encash.booking_unit || '-'}</div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default EncashDetails;
