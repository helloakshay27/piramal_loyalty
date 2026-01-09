import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Confi/baseurl";


function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  };

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${BASE_URL}admin/orders/${id}/order_details.json`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrder(response.data.details || response.data.order || response.data);
    } catch (err) {
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus, notes = "") => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const url = `${BASE_URL}orders/${id}/status_update.json?status=${newStatus}&notes=${encodeURIComponent(notes)}`;
      await axios.put(url, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchOrder();
    } catch (err) {
      setError("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const notes = prompt("Enter notes for status update (optional):");
    if (notes !== null) {
      updateOrderStatus(newStatus, notes);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="w-100">
      <div className="module-data-section mt-2 mb-2">
        <p className="pointer">
          <span>Orders</span> &gt; Order Details
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : order ? (
          <>
            <div className="go-shadow mx-3 no-top-left-shadow ">
              <h5 className="d-flex">
                <span className="title mt-3">ORDER DETAILS</span>
              </h5>
              <div className="row px-3">
                <div className="col-lg-8 col-md-12 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Order ID</div>
                  <div className="col-6 p-1 member-detail-color">: {order.id}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Order Number</div>
                  <div className="col-6 p-1 member-detail-color">: {order.order_number}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Status</div>
                  <div className="col-6 p-1 member-detail-color">
                    :
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={handleStatusChange}
                      disabled={updatingStatus}
                      style={{ maxWidth: '150px', display: 'inline-block', marginLeft: 8 }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                    {updatingStatus && (
                      <span style={{ marginLeft: 8 }}>
                        <span className="spinner-border spinner-border-sm" role="status" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Payment Status</div>
                  <div className="col-6 p-1 member-detail-color">: {order.payment_status}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Total Amount</div>
                  <div className="col-6 p-1 member-detail-color">: ₹{parseFloat(order.total_amount).toFixed(2)}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Points Redeemed</div>
                  <div className="col-6 p-1 member-detail-color">: {typeof order.loyalty_points_redeemed === 'number' ? order.loyalty_points_redeemed.toLocaleString() : '0'} pts</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Total Items</div>
                  <div className="col-6 p-1 member-detail-color">: {order.total_items}</div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">Created At</div>
                  <div className="col-6 p-1 member-detail-color">: {formatDate(order.created_at)}</div>
                </div>
              </div>
            </div>
            <div className="go-shadow mx-3 no-top-left-shadow mt-4">
              <h5 className="d-flex">
                <span className="title mt-3">ORDER ITEMS</span>
              </h5>
              <div className="row px-3">
                <div className="col-12 px-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.order_items && order.order_items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{parseFloat(item.unit_price).toFixed(2)}</td>
                          <td>₹{parseFloat(item.total_price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="go-shadow mx-3 no-top-left-shadow mt-4">
              <h5 className="d-flex">
                <span className="title mt-3">CUSTOMER & SHIPPING</span>
              </h5>
              <div className="row px-3">
                <div className="col-6 p-1 text-muted member-detail-color">Customer Name</div>
                <div className="col-6 p-1 member-detail-color">: {order.user?.name || 'N/A'}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Customer Email</div>
                <div className="col-6 p-1 member-detail-color">: {order.user?.email}</div>
                <div className="col-6 p-1 text-muted member-detail-color">User ID</div>
                <div className="col-6 p-1 member-detail-color">: {order.user?.id}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Shipping Contact</div>
                <div className="col-6 p-1 member-detail-color">: {order.shipping_address?.contact_person}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Shipping Address</div>
                <div className="col-6 p-1 member-detail-color">: {order.shipping_address?.address}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Shipping City</div>
                <div className="col-6 p-1 member-detail-color">: {order.shipping_address?.city}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Shipping State</div>
                <div className="col-6 p-1 member-detail-color">: {order.shipping_address?.state}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Shipping PIN</div>
                <div className="col-6 p-1 member-detail-color">: {order.shipping_address?.pin_code}</div>
                <div className="col-6 p-1 text-muted member-detail-color">Shipping Mobile</div>
                <div className="col-6 p-1 member-detail-color">: {order.shipping_address?.mobile}</div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default OrderDetails;

