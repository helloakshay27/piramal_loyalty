import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import axios from "axios";
import LoginModal from "../components/LoginModal";
import BASE_URL from "../Confi/baseurl";

const Orders = () => {
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [filters, setFilters] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
  const paymentStatusOptions = ["pending", "paid", "partially_paid", "failed", "refunded"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const getOrders = async (page = 1, search = "", status = "", paymentStatus = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setShowModal(true);
        return;
      }

      let url = `${BASE_URL}/admin/orders.json?page=${page}&per_page=${perPage}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (status) {
        url += `&status=${status}`;
      }
      if (paymentStatus) {
        url += `&payment_status=${paymentStatus}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setOrders(response.data.orders || []);
        
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.current_page);
          setTotalCount(response.data.pagination.total_count);
          setTotalPages(Math.ceil(response.data.pagination.total_count / perPage));
        }

        if (response.data.filters) {
          setFilters(response.data.filters);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        setShowModal(true);
      } else {
        setError("Failed to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, notes = "") => {
    try {
      setUpdatingStatus(orderId);
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setShowModal(true);
        return;
      }

      const url = `${BASE_URL}/orders/${orderId}/status_update.json?status=${newStatus}&notes=${encodeURIComponent(notes)}`;
      
      await axios.put(url, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh orders after successful update
      await getOrders(currentPage, searchTerm, statusFilter, paymentStatusFilter);
      
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response?.status === 401) {
        setShowModal(true);
      } else {
        setError("Failed to update order status");
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    getOrders(currentPage, searchTerm, statusFilter, paymentStatusFilter);
  }, [currentPage, searchTerm, statusFilter, paymentStatusFilter]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePaymentStatusFilter = (e) => {
    setPaymentStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const notes = prompt("Enter notes for status update (optional):");
    if (notes !== null) { // User didn't cancel
      updateOrderStatus(orderId, newStatus, notes);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="btn btn-outline-primary mx-1"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="mx-1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`btn mx-1 ${currentPage === i ? 'btn-primary' : 'btn-outline-primary'}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="mx-1">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="btn btn-outline-primary mx-1"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'confirmed': return 'badge bg-info';
      case 'processing': return 'badge bg-primary';
      case 'shipped': return 'badge bg-secondary';
      case 'delivered': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      case 'refunded': return 'badge bg-dark';
      default: return 'badge bg-light text-dark';
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'paid': return 'badge bg-success';
      case 'partially_paid': return 'badge bg-info';
      case 'failed': return 'badge bg-danger';
      case 'refunded': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container-fluid">
        <SubHeader />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container-fluid px-0 my-4">
        <div className="row mx-0">
          <div className="col-lg-12 px-0">
            <div className="main_content_iner overly_inner">
              <div className="container-fluid p-0">
         

                {/* Filters */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label">Search Orders</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by order number, user email..."
                              value={searchTerm}
                              onChange={handleSearch}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Status Filter</label>
                            <select
                              className="form-select"
                              value={statusFilter}
                              onChange={handleStatusFilter}
                            >
                              <option value="">All Statuses</option>
                              {statusOptions.map(status => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Payment Status Filter</label>
                            <select
                              className="form-select"
                              value={paymentStatusFilter}
                              onChange={handlePaymentStatusFilter}
                            >
                              <option value="">All Payment Statuses</option>
                              {paymentStatusOptions.map(status => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-2 d-flex align-items-end">
                            <button
                              className="btn btn-secondary w-100"
                              onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("");
                                setPaymentStatusFilter("");
                                setCurrentPage(1);
                              }}
                            >
                              Clear Filters
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">
                          Orders List ({totalCount} total)
                        </h5>
                      </div>
                      <div className="card-body">
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}
                        
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-light">
                              <tr>
                                <th>Order ID</th>
                                <th>Order Number</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Payment Status</th>
                                <th>Total Amount</th>
                                <th>Points Redeemed</th>
                                <th>Items</th>
                                <th>Created At</th>
                                {/* <th>Actions</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {orders.length > 0 ? (
                                orders.map((order) => (
                                  <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>
                                      <small className="text-muted">{order.order_number}</small>
                                    </td>
                                    <td>
                                      <div>
                                        <div className="fw-semibold">{order.user.name || 'N/A'}</div>
                                        <small className="text-muted">{order.user.email}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <select
                                        className={`form-select form-select-sm ${getStatusBadgeClass(order.status)}`}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        disabled={updatingStatus === order.id}
                                        style={{ maxWidth: '120px' }}
                                      >
                                        {statusOptions.map(status => (
                                          <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                          </option>
                                        ))}
                                      </select>
                                      {updatingStatus === order.id && (
                                        <div className="spinner-border spinner-border-sm mt-1" role="status">
                                          <span className="visually-hidden">Updating...</span>
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      <span className={getPaymentStatusBadgeClass(order.payment_status)}>
                                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1).replace('_', ' ')}
                                      </span>
                                    </td>
                                    <td>
                                      <div>
                                        <div className="fw-semibold">₹{parseFloat(order.total_amount).toFixed(2)}</div>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary">
                                        {order.loyalty_points_redeemed.toLocaleString()} pts
                                      </span>
                                    </td>
                                    <td>
                                      <div>
                                        <div className="fw-semibold">{order.total_items} item(s)</div>
                                        {order.order_items.length > 0 && (
                                          <small className="text-muted">
                                            {order.order_items[0].product_name}
                                            {order.order_items.length > 1 && ` +${order.order_items.length - 1} more`}
                                          </small>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <small>{formatDate(order.created_at)}</small>
                                    </td>
                                    {/* <td>
                                      <div className="dropdown">
                                        <button
                                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          Actions
                                        </button>
                                        <ul className="dropdown-menu">
                                          <li>
                                            <Link 
                                              className="dropdown-item"
                                              to={`/order-details/${order.id}`}
                                            >
                                              View Details
                                            </Link>
                                          </li>
                                          {order.can_be_cancelled && (
                                            <li>
                                              <button 
                                                className="dropdown-item text-danger"
                                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                                              >
                                                Cancel Order
                                              </button>
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    </td> */}
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="10" className="text-center py-4">
                                    <div className="text-muted">
                                      <i className="fas fa-shopping-cart fa-3x mb-3 d-block"></i>
                                      No orders found
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="text-muted">
                              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalCount)} of {totalCount} orders
                            </div>
                            <div className="pagination-wrapper">
                              <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                Previous
                              </button>
                              {renderPagination()}
                              <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <LoginModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default Orders;
