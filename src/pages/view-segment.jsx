// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "../styles/style.css";
// import SubHeader from "../components/SubHeader";
// import axios from "axios";

// const ViewSegment = () => {
//   const { id } = useParams();
//   const [segment, setSegment] = useState(null);
//   const [members, setMembers] = useState([]);
//   const [totalMembers, setTotalMembers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch segment details by ID
//   const getSegmentDetails = async (id) => {
//     const storedValue = sessionStorage.getItem("selectedId");
//     try {
//       const response = await axios.get(
//         `https://staging.lockated.com/loyalty/segments/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&&q[loyalty_type_id_eq]=${storedValue}`
//       );
//       setMembers(response.data.loyalty_members)
//       console.log("Segment Details Response:", response.data); // Debugging log
//       return response.data;

//     } catch (error) {
//       console.error("Error fetching segment details:", error);
//       throw error;
//     }
//   };

//  // Fetch specific member details by member IDs
//   const getMemberDetails = async (memberIds) => {
//     try {
//       // Ensure we use only the specific segment member IDs
//       const response = await axios.get(
//        `https://staging.lockated.com/loyalty/segments/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&&q[loyalty_type_id_eq]=${storedValue}`
//       );
//       console.log("Member Details Fetched:", response.data);
//       setMembers(response.data.loyalty_members) // Debugging log
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching member details:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const fetchSegment = async () => {
//       setLoading(true);
//       try {
//         const data = await getSegmentDetails(id);
//         setSegment(data);

//         // Extract and log specific segment member IDs
//         const segmentMemberIds = data.loyalty_members?.map((member) => member.id) || [];
//         console.log("Segment-Specific Member IDs:", segmentMemberIds); // Debugging log

//         setTotalMembers(segmentMemberIds.length); // Set total member count for segment

//         // if (segmentMemberIds.length > 0) {
//         //   // Fetch details only for these segment-specific members
//         //   const membersData = await getMemberDetails(segmentMemberIds);
//         //   setMembers(membersData); // Update state with filtered member data
//         // } else {
//         //   setMembers([]); // No members for this segment
//         // }
//       } catch (err) {
//         setError("Failed to load segment details.");
//         console.error("Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSegment();
//   }, [id]);

//   return (
//     <>
//       <div className="w-100">
//         <SubHeader />
//         <div className="module-data-section mt-2">
//           <p className="pointer">
//             <span>Segment</span> &gt; Segment Details
//           </p>

//           {loading ? (
//             <p>Loading...</p>
//           ) : error ? (
//             <p>{error}</p>
//           ) : segment ? (
//             <div className="go-shadow mx-3 no-top-left-shadow">
//               <h5 className="d-flex">
//                 <span className="title mt-3">SEGMENT DETAILS</span>
//               </h5>
//               <div className="row px-3">
//                 <div className="col-lg-8 col-md-12 col-sm-12 row px-3">
//                   <div className="col-6 p-1 text-muted member-detail-color">
//                     Segment Name
//                   </div>
//                   <div className="col-6 p-1 member-detail-color">
//                    : {segment.name || "N/A"}
//                   </div>
//                 </div>
//                 <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
//                   <div className="col-6 p-1 text-muted member-detail-color">
//                     Segment Tag
//                   </div>
//                   <div className="col-6 p-1 member-detail-color">
//                     : {segment.segment_tag || "N/A"}
//                   </div>
//                 </div>
//                 <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
//                   <div className="col-6 p-1 text-muted member-detail-color">
//                     Segment Type
//                   </div>
//                   <div className="col-6 p-1 member-detail-color">
//                    : {segment.segment_type || "N/A"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p>Segment details not available.</p>
//           )}

//           {/* Display Filtered Members */}
//           <div className="filtered-data-section mt-4">
//             <h5 className="ms-3">Members List</h5>

//             {/* Show total member count */}
//             <p className="ms-3">
//               Total Members: {totalMembers}
//             </p>

//             <div className="tbl-container mx-3 mt-4">
//               <table className="w-100" style={{ color: "#000", fontWeight: "400", fontSize: "13px", align: "center" }}>
//                 <thead>
//                   <tr>
//                     <th style={{ width: "200px", height: "40px" }}>Name</th>
//                     <th style={{ width: "200px", height: "40px" }}>Email</th>
//                     <th style={{ width: "200px", height: "40px" }}>Address</th>
//                     <th style={{ width: "100px", height: "40px" }}>Gender</th>
//                     <th style={{ width: "100px", height: "40px" }}>Status</th>
//                     <th style={{ width: "100px", height: "40px" }}>Loyalty Points</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {members.length > 0 ? (
//                     members.map((member) => (
//                       <tr key={member.id}>
//                         <td>{member.name || "N/A"}</td>
//                         <td>{member.email || "N/A"}</td>
//                         <td>{member.address ? `${member.address.address1 || ''} ${member.address.address2 || ''}` : "N/A"}</td>
//                         <td>{member.gender || "N/A"}</td>
//                         <td>{member.status || "N/A"}</td>
//                         <td>{member.loyalty_points || 0}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" style={{ textAlign: "center" }}>No members found for this segment.</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ViewSegment;

import React, { useState, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import "../styles/style.css";
import SubHeader from "../components/SubHeader";
import axios from "axios";
import BASE_URL from "../Confi/baseurl";


const ViewSegment = () => {
  const { id } = useParams();
  const [segment, setSegment] = useState(null);
  const [members, setMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define the number of items per page
  const token=localStorage.getItem("access_token");

  // Fetch segment details by ID
  const getSegmentDetails = async (id) => {
    const storedValue = sessionStorage.getItem("selectedId");
    try {
      const response = await axios.get(
        `${BASE_URL}/loyalty/segments/${id}.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );
      setMembers(response.data.loyalty_members);
      setTotalMembers(response.data.loyalty_members.length); // Set total member count
      console.log("Segment Details Response:", response.data); // Debugging log
      return response.data;
    } catch (error) {
      console.error("Error fetching segment details:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchSegment = async () => {
      setLoading(true);
      try {
        const data = await getSegmentDetails(id);
        setSegment(data);
      } catch (err) {
        // @ts-ignore
        setError("Failed to load segment details.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSegment();
  }, [id]);

  // Paginated member data
  const paginatedMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(totalMembers / itemsPerPage);

  // Handler for page change
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className="w-100">
        {/* <SubHeader /> */}
        <div className="module-data-section mt-2">
          <p className="pointer">
          <Link to='/segment'>
            <span className=" text-dark font-weight-bold ">Segment</span>
            </Link>{" "}
             &gt;
             Segment Details
          </p>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : segment ? (
            <div className="go-shadow mx-3 no-top-left-shadow">
              <h5 className="d-flex">
                <span className="title mt-3">SEGMENT DETAILS</span>
              </h5>
              <div className="row px-3">
                <div className="col-lg-8 col-md-12 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">
                    Segment Name
                  </div>
                  <div className="col-6 p-1 member-detail-color">
                    : {segment.
// @ts-ignore
                    name || "N/A"}
                  </div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">
                    Segment Tag
                  </div>
                  <div className="col-6 p-1 member-detail-color">
                    : {segment.
// @ts-ignore
                    segment_tag || "N/A"}
                  </div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div className="col-6 p-1 text-muted member-detail-color">
                    Segment Type
                  </div>
                  <div className="col-6 p-1 member-detail-color">
                    : {segment.
// @ts-ignore
                    segment_type || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Segment details not available.</p>
          )}

          {/* Display Filtered Members */}
          <div className="filtered-data-section mt-4">
            <h5 className="ms-3 title mt-3">MEMBERS DETAILS</h5>

            {/* Show total member count */}
            <p className="ms-3">Total Members: {totalMembers}</p>

            <div className="tbl-container mx-3 mt-4">
              <table
                className="w-100"
                style={{
                  color: "#000",
                  fontWeight: "400",
                  fontSize: "13px",
                  // @ts-ignore
                  align: "center",
                }}
              >
                <thead>
                  {/* <tr>
                    <th style={{ width: "200px", height: "40px" }}>Name</th>
                    <th style={{ width: "200px", height: "40px" }}>Email</th>
                    <th style={{ width: "200px", height: "40px" }}>Address</th>
                    <th style={{ width: "100px", height: "40px" }}>Gender</th>
                    <th style={{ width: "100px", height: "40px" }}>Status</th>
                    <th style={{ width: "100px", height: "40px" }}>
                      Loyalty Points
                    </th>
                  </tr> */}

                  <tr>
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
                      colSpan="6" style={{ textAlign: "center" }}>
                        No members found for this segment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalEntries={totalMembers}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// // Pagination component definition here
// const Pagination = ({
//   currentPage,
//   totalPages,
//   totalEntries,
//   onPageChange,
// }) => {
//   const itemsPerPage = 10; // Items per page should match the main component
//   const startEntry = (currentPage - 1) * itemsPerPage + 1;
//   const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
//     const halfVisible = Math.floor(maxVisiblePages / 2);
//     let startPage, endPage;

//     if (totalPages <= maxVisiblePages) {
//       startPage = 1;
//       endPage = totalPages;
//     } else {
//       if (currentPage <= halfVisible) {
//         startPage = 1;
//         endPage = maxVisiblePages;
//       } else if (currentPage + halfVisible >= totalPages) {
//         startPage = totalPages - maxVisiblePages + 1;
//         endPage = totalPages;
//       } else {
//         startPage = currentPage - halfVisible;
//         endPage = currentPage + halfVisible;
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <nav className="d-flex justify-content-between align-items-center">
//       <ul
//         className="pagination justify-content-center align-items-center"
//         style={{ listStyleType: "none", padding: "0" }}
//       >
//         <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//           <button
//             className="page-link"
//             onClick={() => onPageChange(1)}
//             disabled={currentPage === 1}
//             style={{ padding: "8px 12px", color: "#5e2750" }}
//           >
//             ««
//           </button>
//         </li>
//         <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//           <button
//             className="page-link"
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             style={{ padding: "8px 12px", color: "#5e2750" }}
//           >
//             ‹
//           </button>
//         </li>

//         {pageNumbers.map((page) => (
//           <li
//             key={page}
//             className={`page-item ${page === currentPage ? "active" : ""}`}
//           >
//             <button
//               className="page-link"
//               onClick={() => onPageChange(page)}
//               style={{
//                 padding: "8px 12px",
//                 color: page === currentPage ? "#fff" : "#5e2750",
//                 backgroundColor: page === currentPage ? "#5e2750" : "#fff",
//                 border: "2px solid #5e2750",
//                 borderRadius: "3px",
//               }}
//             >
//               {page}
//             </button>
//           </li>
//         ))}

//         <li
//           className={`page-item ${
//             currentPage === totalPages ? "disabled" : ""
//           }`}
//         >
//           <button
//             className="page-link"
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             style={{ padding: "8px 12px", color: "#5e2750" }}
//           >
//             ›
//           </button>
//         </li>
//         <li
//           className={`page-item ${
//             currentPage === totalPages ? "disabled" : ""
//           }`}
//         >
//           <button
//             className="page-link"
//             onClick={() => onPageChange(totalPages)}
//             disabled={currentPage === totalPages}
//             style={{ padding: "8px 12px", color: "#5e2750" }}
//           >
//             »»
//           </button>
//         </li>
//       </ul>
//       <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
//         Showing {startEntry} to {endEntry} of {totalEntries} entries
//       </p>
//     </nav>
//   );
// };

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
            onClick={() => onPageChange(Math.min(currentPage + 10, totalPages))}
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

export default ViewSegment;
