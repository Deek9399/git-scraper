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
    const isActive = sortConfig.key === key;
    const direction = isActive && sortConfig.direction === "desc" ? "▼" : "▲";
    return (
      <span className={`sort-arrow ${isActive ? "active" : ""}`}>
        {direction}
      </span>
    );
  };

  const renderHeader = (label, key) => (
    <span className="table-header">
      {label}
      {renderArrow(key)}
    </span>
  );

  const handleViewDetails = (repo) => {
    navigate(`/details/${repo.id}`, { state: { repo } });
  };

  return (
    <div className="table-wrapper">
      <div className="records-control">
        <label htmlFor="recordsPerPage">Records:</label>
        <select
          id="recordsPerPage"
          value={recordsPerPage}
          onChange={(e) => {
            setRecordsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <table className="repo-table styled-repo-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              {renderHeader("Repository", "name")}
            </th>
            <th>Description</th>
            <th onClick={() => handleSort("updated_at")}>
              {renderHeader("Last Modified", "updated_at")}
            </th>
            <th>License</th>
            <th onClick={() => handleSort("forks_count")}>
              {renderHeader("Forks", "forks_count")}
            </th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {currentRepos.map((repo) => (
            <tr key={repo.id}>
              <td>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer">
                  {repo.name}
                </a>
              </td>
              <td>{repo.description || "No description"}</td>
              <td>{new Date(repo.updated_at).toLocaleDateString()}</td>
              <td>{repo.license?.name || "No license"}</td>
              <td>{repo.forks_count}</td>
              <td>
                <button
                  onClick={() => handleViewDetails(repo)}
                  className="view-btn">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}>
          ◀︎
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}>
          ▶︎
        </button>
      </div>
    </div>
  );
};

export default RepoTable;
