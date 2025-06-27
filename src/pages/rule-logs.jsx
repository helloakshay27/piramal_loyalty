import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function RuleLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  };

  const parseChangedAttr = (attrString) => {
    try {
      const attrArray = JSON.parse(attrString);
      if (Array.isArray(attrArray) && attrArray.length > 0) {
        const attr = attrArray[0];
        return `Attr: ${attr.condition_attribute}, Op: ${attr.operator}, Val: ${attr.compare_value}`;
      }
      return 'N/A';
    } catch (e) {
      return 'Invalid format';
    }
  };

  const getCreationDate = (attrString) => {
    try {
      const attrArray = JSON.parse(attrString);
      if (Array.isArray(attrArray) && attrArray.length > 0) {
        return attrArray[0].created_at;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const getRuleLogs = async () => {
    try {
      const response = await axios.get(
        `https://piramal-loyalty-dev.lockated.com/get_rule_logs`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const processedLogs = response.data.map(log => {
        const parsed = JSON.parse(log.changed_attr)[0] || {};
        return {
            ...log,
            created_at_from_attr: parsed.created_at
        }
      });
      setLogs(processedLogs);
      setFilteredItems(processedLogs);
    } catch (err) {
      console.error("Error fetching rule logs:", err);
      setError("Failed to fetch rule logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRuleLogs();
  }, []);

  const handleReset = () => {
    setSearchTerm("");
    setFilteredItems(logs);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const filtered = logs.filter((log) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      const parsedAttr = parseChangedAttr(log.changed_attr).toLowerCase();
      return [
        log.id,
        log.log_of,
        log.log_of_id,
        log.about,
        log.about_id,
        parsedAttr,
        formatDate(getCreationDate(log.changed_attr))
      ]
        .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
        .some((v) => v.includes(q));
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'created_at_from_attr') {
            const dateA = new Date(aVal).getTime();
            const dateB = new Date(bVal).getTime();
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }

        if (aVal === null || aVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bVal === null || bVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;

        if (['id', 'log_of_id', 'about_id'].includes(sortConfig.key)) {
            aVal = Number(aVal);
            bVal = Number(bVal);
        }

        if (String(aVal).toLowerCase() < String(bVal).toLowerCase()) return sortConfig.direction === 'asc' ? -1 : 1;
        if (String(aVal).toLowerCase() > String(bVal).toLowerCase()) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const currentItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const Pagination = ({ currentPage, totalPages, totalEntries, onPageChange }) => {
    const startEntry = totalEntries > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
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
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <nav className="d-flex justify-content-between align-items-center mt-3">
        <p className="text-center" style={{ color: "#555" }}>
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </p>
        <ul className="pagination justify-content-center align-items-center" style={{ listStyleType: "none", padding: "0", margin: "0" }}>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(1)} disabled={currentPage === 1} style={{ padding: "8px 12px", color: "#5e2750" }}>««</button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={{ padding: "8px 12px", color: "#5e2750" }}>‹</button>
          </li>
          {pageNumbers.map((page) => (
            <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(page)} style={{ padding: "8px 12px", color: page === currentPage ? "#fff" : "#5e2750", backgroundColor: page === currentPage ? "#5e2750" : "#fff", border: "2px solid #5e2750", borderRadius: "3px" }}>{page}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: "8px 12px", color: "#5e2750" }}>›</button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} style={{ padding: "8px 12px", color: "#5e2750" }}>»»</button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="w-100">
      <div className="module-data-section mt-2">
        <p className="pointer">
          <span>Rules</span> &gt; Rule Logs
        </p>
        <h5>Rule Logs</h5>

        <div className="d-flex justify-content-end align-items-center">
          <div className="d-flex align-items-center">
            <div className="position-relative me-2">
              <input
                className="form-control"
                style={{ height: "35px", paddingLeft: "30px" }}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="position-absolute" style={{ top: "7px", left: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </div>
            </div>
            <button className="purple-btn1 rounded-3 px-3" onClick={handleSearch}>Go!</button>
            <button className="purple-btn2 rounded-3 ms-2" onClick={handleReset}>Reset</button>
          </div>
        </div>

        <div className="tbl-container mx-3 mt-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <>
              <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>Log ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => requestSort('log_of')} style={{ cursor: 'pointer' }}>Log Of {sortConfig.key === 'log_of' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => requestSort('log_of_id')} style={{ cursor: 'pointer' }}>Log Of ID {sortConfig.key === 'log_of_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => requestSort('about')} style={{ cursor: 'pointer' }}>About {sortConfig.key === 'about' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => requestSort('about_id')} style={{ cursor: 'pointer' }}>About ID {sortConfig.key === 'about_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th>Change Details</th>
                    <th onClick={() => requestSort('created_at_from_attr')} style={{ cursor: 'pointer' }}>Date {sortConfig.key === 'created_at_from_attr' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                  {currentItems.length > 0 ? currentItems.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.log_of}</td>
                      <td>{log.log_of_id}</td>
                      <td>{log.about}</td>
                      <td>{log.about_id}</td>
                      <td>{parseChangedAttr(log.changed_attr)}</td>
                      <td>{formatDate(log.created_at_from_attr)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="text-center py-3">No logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalEntries={sortedItems.length} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}