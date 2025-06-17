import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// @ts-ignore
import { Button } from "react-bootstrap";
import SubHeader from "../components/SubHeader";
// import { toast } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import BASE_URL from "../Confi/baseurl";

const EditSegment = () => {
  const { id } = useParams(); // Get the segment ID from the URL
  const [segment, setSegment] = useState(null);
  const token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    name: "",
    segment_tag: "",
    // member_count: "",

    loyalty_members: {
      member_ids: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define the number of items per page
  // Fetch the segment details using the segment ID

  const [selectedMembers, setSelectedMembers] = useState([]);

  // const handleCheckboxChange = (e, memberId) => {

  //   const newSelectedMembers = e.target.checked
  //     ? [...selectedMembers, memberId]
  //     : selectedMembers.filter((id) => id !== memberId);

  //   setSelectedMembers(newSelectedMembers);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     member_count: newSelectedMembers.length,
  //   }));
  // };

  const resetForm = () => {
    setFormData({
      // @ts-ignore
      name: segment.name,
      // @ts-ignore
      segment_tag: segment.segment_tag,
      // @ts-ignore
      member_count: segment.loyalty_members.length,
      loyalty_members: {
        // @ts-ignore
        member_ids: segment.loyalty_members.map((member) => member.id),
      },
    });
    // @ts-ignore
    setSelectedMembers(segment.loyalty_members.map((member) => member.id));
  };

  const handleCheckboxChange = (e, memberId) => {
    const newSelectedMembers = e.target.checked
      ? [...selectedMembers, memberId]
      : selectedMembers.filter((id) => id !== memberId);

    // @ts-ignore
    setSelectedMembers(newSelectedMembers);
    // @ts-ignore
    setFormData((prevData) => ({
      ...prevData,
      member_count: newSelectedMembers.length,
      loyalty_members: {
        member_ids: newSelectedMembers,
      },
    }));
  };

  useEffect(() => {
    const fetchSegment = async () => {
      const storedValue = sessionStorage.getItem("selectedId");
      try {
        const response = await axios.get(
          `${BASE_URL}/loyalty/segments/${id}.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
        );
        setSegment(response.data);
        // setFormData({
        //   name: response.data.name,
        //   segment_tag: response.data.segment_tag,
        //   member_count: response.data.member_count,

        // });

        setFormData({
          name: response.data.name,
          segment_tag: response.data.segment_tag,
          // @ts-ignore
          member_count: response.data.loyalty_members.length,
          loyalty_members: {
            member_ids: response.data.loyalty_members.map(
              (member) => member.id
            ),
          },
        });
        setSelectedMembers(
          response.data.loyalty_members.map((member) => member.id)
        );
        setMembers(response.data.loyalty_members);
        setTotalMembers(response.data.loyalty_members.length);
        setLoading(false);

        // setMembers(response.data.loyalty_members);
        // setTotalMembers(response.data.loyalty_members.length);
        // setLoading(false);
        // const initialSelectedMembers = response.data.loyalty_members.map(member => member.id);
        // setSelectedMembers(initialSelectedMembers);

        // Update count based on selected members
      } catch (error) {
        setError("Failed to fetch segment details.");
        setLoading(false);
      }
    };
    fetchSegment();
  }, [id]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const paginatedMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(totalMembers / itemsPerPage);

  // Handler for page change
  const handlePageChange = (page) => setCurrentPage(page);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      // Show a toast if the "name" field is empty
      toast.error("Name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return; // Prevent further execution if the name is missing
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/loyalty/segments/${id}.json?token=${token}`,
        {
          loyalty_segment: {
            ...formData, // includes name and
          },
        }
      );

      if (response.data) {
        // Optionally set a success message or reset form if needed
        navigate("/segment"); // Navigate back to segment list
      }
    } catch (error) {
      setError("Failed to update segment.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  const Pagination = ({
    currentPage,
    totalPages,
    totalEntries,
    onPageChange,
  }) => {
    const itemsPerPage = 10; // Items per page should match the main component
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage, endPage;

      if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
      } else {
        if (currentPage <= halfVisible) {
          startPage = 1;
          endPage = maxVisiblePages;
        } else if (currentPage + halfVisible >= totalPages) {
          startPage = totalPages - maxVisiblePages + 1;
          endPage = totalPages;
        } else {
          startPage = currentPage - halfVisible;
          endPage = currentPage + halfVisible;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <nav className="d-flex justify-content-between align-items-center">
        <ul
          className="pagination justify-content-center align-items-center"
          style={{ listStyleType: "none", padding: "0" }}
        >
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(Math.max(currentPage - 10, 1))}
              disabled={currentPage === 1}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              ««
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              ‹
            </button>
          </li>

          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(page)}
                style={{
                  padding: "8px 12px",
                  color: page === currentPage ? "#fff" : "#5e2750",
                  backgroundColor: page === currentPage ? "#5e2750" : "#fff",
                  border: "2px solid #5e2750",
                  borderRadius: "3px",
                }}
              >
                {page}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              ›
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() =>
                onPageChange(Math.min(currentPage + 10, totalPages))
              }
              disabled={currentPage === totalPages}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              »»
            </button>
          </li>
        </ul>
        <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </p>
      </nav>
    );
  };

  return (
    <div className="w-100">
      {/* <SubHeader /> */}
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="module-data-section mt-2 ms-3 ">
          <p className="pointer">
            <Link to="/segment">
              <span className=" text-dark font-weight-bold ">Segment</span>
            </Link>{" "}
            &gt; Edit Segment
          </p>
          <h5 className="mb-1 title" style={{ marginTop: "33px" }}>
            Edit Segment
          </h5>
          {/* <div className="go-shadow me-3 pb-4"> */}
          <div className="row  mt-2" style={{ marginBottom: "30px" }}>
            <fieldset className="border col-md-3 m-2 col-sm-11 ms-3 ">
              <legend
                className="float-none"
                style={{
                  fontSize: "14px", // Adjust font size for visibility

                  padding: "6px", // Padding to ensure full visibility of text
                  lineHeight: "1.2", // Adjust line-height for better readability
                  marginBottom: "-8px", // Slight negative margin if legend is too high
                }}
              >
                Segment Name<span>*</span>
              </legend>

              <input
                type="text"
                className="border w-100 p-2 py-2 border-bottom pb-2 border-0 border-bottom-0 bold-placeholder form-group"
                placeholder="Enter Segment Name"
                // @ts-ignore
                required=""
                value={formData.name}
                onChange={handleInputChange}
                name="name"
              />
            </fieldset>

            <fieldset className="border col-md-3 m-2 col-sm-11 ">
              <legend
                className="float-none"
                style={{
                  fontSize: "14px", // Adjust font size for visibility

                  padding: "6px", // Padding to ensure full visibility of text
                  lineHeight: "1.2", // Adjust line-height for better readability
                  marginBottom: "-8px", // Slight negative margin if legend is too high
                }}
              >
                Segment tag<span>*</span>
              </legend>
              <select
                className="mt-1 mb-1"
                // @ts-ignore
                required=""
                value={formData.segment_tag}
                onChange={handleInputChange}
                name="segment_tag"
              >
                <option value="" disabled selected hidden>
                  Select Segment tag
                </option>

                <option value="Recently joined">Recently joined</option>
                <option value="Suspended">Suspended</option>
                <option value="1-purchase">1-purchase</option>
                <option value="No purchase">No purchase</option>
              </select>
            </fieldset>
          </div>
        </div>
        {/* <div className="form-group ms-4 "
         style={{ marginBottom: "50px" }}
         >
          <label
            htmlFor="member_count"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#333",
              padding: "6px",
              lineHeight: "1.2",
             
            }}
          >
            Member Count<span>*</span>
          </label>
          <input
            type="text"
            id="member_count"
            name="member_count"
            className="form-control"
            value={formData.member_count}
            onChange={handleInputChange}
            style={{
              width: "10%",
              padding: "10px",
              fontSize: "13px",
              color: "#555",
              border: "1px solid #ccc",
              borderRadius: "5px",
              outline: "none",
              fontWeight: "400",
            }}
          />
        </div> */}

        <div className="filtered-data-section  ms-3">
          <h5 className="ms-3 title">Members List</h5>

          <div className="tbl-container mx-3 mt-4">
            <table
              className="w-100 "
              style={{
                color: "#000",
                fontWeight: "400",
                fontSize: "13px",
                // @ts-ignore
                align: "center",
              }}
            >
              {" "}
              <thead>
                <tr>
                  <th
                    style={{
                      width: "400px",
                      fontWeight: "400",
                      fontSize: "13px",
                      height: "40px",
                    }}
                  >
                    Select
                  </th>
                  <th
                    style={{
                      width: "400px",
                      fontWeight: "400",
                      fontSize: "13px",
                      height: "40px",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      width: "400px",
                      fontWeight: "400",
                      fontSize: "13px",
                      height: "40px",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      width: "400px",
                      fontWeight: "400",
                      fontSize: "13px",
                      height: "40px",
                    }}
                  >
                    Address
                  </th>
                  <th
                    style={{
                      width: "400px",
                      fontWeight: "400",
                      fontSize: "13px",
                      height: "40px",
                    }}
                  >
                    Gender
                  </th>
                  <th
                    style={{
                      width: "400px",
                      fontWeight: "400",
                      fontSize: "13px",
                      height: "40px",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      width: "400px",
                      fontWeight: "400",
                      fontSize: "13px",
                      height: "40px",
                    }}
                  >
                    Loyalty Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.length > 0 ? (
                  paginatedMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <input
                          type="checkbox"
                          // @ts-ignore
                          checked={selectedMembers.includes(member.id)} // Make it checked by default
                          onChange={(e) => handleCheckboxChange(e, member.id)} // Optional: handler if you want to capture change
                        />
                      </td>
                      <td>{member.name || "N/A"}</td>
                      <td>{member.email || "N/A"}</td>
                      <td>
                        {member.address
                          ? `${member.address.address1 || ""} ${
                              member.address.address2 || ""
                            }`
                          : "N/A"}
                      </td>
                      <td>{member.gender || "N/A"}</td>
                      <td>{member.status || "N/A"}</td>
                      <td>{member.loyalty_points || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      // @ts-ignore
                      colSpan="6"
                      style={{ textAlign: "center" }}
                    >
                      No members found for this segment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={totalMembers}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="row mt-3 justify-content-center">
          <div className="col-md-2">
            <button className="purple-btn1 w-100" type="submit">
              Submit
            </button>
          </div>

          <div className="col-md-2">
            <button
              className="purple-btn2 w-100"
              onClick={(e) => {
                e.preventDefault(); // Prevent default button action
                resetForm(); // Call the reset function to clear updates
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
        {/* <Button variant="primary" type="submit">
          Save Changes
        </Button> */}
      </form>
    </div>
  );
};

export default EditSegment;
