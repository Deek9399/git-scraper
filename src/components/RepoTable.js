import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const RepoTable = ({ repos }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: "updated_at",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10); // Default is 10

  const sortedRepos = [...repos].sort((a, b) => {
    const key = sortConfig.key;
    const aValue = a[key] ?? "";
    const bValue = b[key] ?? "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedRepos.length / recordsPerPage);
  const indexOfLastRepo = currentPage * recordsPerPage;
  const indexOfFirstRepo = indexOfLastRepo - recordsPerPage;
  const currentRepos = sortedRepos.slice(indexOfFirstRepo, indexOfLastRepo);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "⇅";
  };
  const thStyle = {
    padding: "12px",
    borderBottom: "1px solid #000000",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "14px",
    backgroundColor: "#F6F8FA",
    color: "#24292E",
    position: "sticky", // enables sticky header
    top: 0, // stick to the top
    zIndex: 1, // above scrollable content
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #E1E4E8",
    fontSize: "14px",
    color: "#24292E",
  };

  const trStyle = {
    backgroundColor: "#FFFFFF",
    transition: "background-color 0.2s",
  };

  const viewBtnStyle = {
    padding: "6px 12px",
    backgroundColor: "#2DA44E",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "13px",
  };

  const handleViewDetails = (repo) => {
    navigate(`/details/${repo.id}`, { state: { repo } });
  };

  return (
    <div style={{ width: "100%", maxWidth: "90vw" }}>
      <div
        style={{
          marginBottom: "1rem",
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "0.5rem",
        }}>
        <label
          htmlFor="recordsPerPage"
          style={{
            fontSize: "0.95rem",
            color: "#57606A",
          }}>
          Records per page:
        </label>
        <select
          id="recordsPerPage"
          value={recordsPerPage}
          onChange={(e) => {
            setRecordsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            padding: "6px 10px",
            fontSize: "0.95rem",
            backgroundColor: "#FFFFFF",
            color: "#24292E",
            border: "1px solid #D0D7DE",
            borderRadius: "6px",
            outline: "none",
            cursor: "pointer",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
          }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <table
        className="repo-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#FFFFFF",
          border: "1px solid #D0D7DE",
          borderRadius: "6px",
          overflow: "hidden",
        }}>
        <thead>
          <tr style={{ backgroundColor: "#F6F8FA", color: "#24292E" }}>
            <th style={thStyle} onClick={() => handleSort("name")}>
              Repository Name {renderArrow("name")}
            </th>
            <th style={thStyle}>Description</th>
            <th style={thStyle} onClick={() => handleSort("updated_at")}>
              Last Modified {renderArrow("updated_at")}
            </th>
            <th style={thStyle}>License</th>
            <th style={thStyle} onClick={() => handleSort("forks_count")}>
              Forks {renderArrow("forks_count")}
            </th>
            <th style={thStyle}>View</th>
          </tr>
        </thead>
        <tbody>
          {currentRepos.map((repo) => (
            <tr key={repo.id} style={trStyle}>
              <td style={tdStyle}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0969DA",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}>
                  {repo.name}
                </a>
              </td>
              <td style={tdStyle}>{repo.description || "No description"}</td>
              <td style={tdStyle}>
                {new Date(repo.updated_at).toLocaleDateString()}
              </td>
              <td style={tdStyle}>{repo.license?.name || "No license"}</td>
              <td style={tdStyle}>{repo.forks_count}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleViewDetails(repo)}
                  style={viewBtnStyle}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="pagination"
        style={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          fontSize: "14px",
        }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={{
            padding: "6px 12px",
            border: "1px solid #D0D7DE",
            backgroundColor: "#FFFFFF",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            color: "#0969DA",
            borderRadius: "6px",
          }}>
          ⬅ Prev
        </button>
        <span style={{ color: "#57606A" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            padding: "6px 12px",
            border: "1px solid #D0D7DE",
            backgroundColor: "#FFFFFF",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            color: "#0969DA",
            borderRadius: "6px",
          }}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default RepoTable;
