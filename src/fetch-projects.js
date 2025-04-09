import React, { useState } from "react";
import "./index.css";

const licenseMap = {
  mit: "mit",
  gnu: "gpl-3.0",
  gpl: "gpl-3.0",
  apache: "apache-2.0",
  bsd: "bsd-2-clause",
  unlicense: "unlicense",
  lgpl: "lgpl-3.0",
  mozilla: "mpl-2.0",
  eclipse: "epl-2.0",
};

const GitHubCProjects = () => {
  const [repos, setRepos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      setError("Please enter search keywords.");
      setRepos([]);
      return;
    }

    const rawKeywords = trimmed
      .split(",")
      .map((kw) => kw.trim().toLowerCase())
      .filter((kw) => kw.length > 0);

    if (rawKeywords.length > 6) {
      setError("Keyword limit reached. Please enter no more than 6 keywords.");
      setRepos([]);
      return;
    }

    const licenseFilters = new Set();
    const normalKeywords = [];

    rawKeywords.forEach((kw) => {
      const license = licenseMap[kw];
      if (license) {
        licenseFilters.add(license);
      } else {
        normalKeywords.push(kw);
      }
    });

    const queryParts = ["language:C", ...normalKeywords];

    if (licenseFilters.size === 1) {
      queryParts.push(`license:${Array.from(licenseFilters)[0]}`);
    }

    const finalQuery = queryParts.join("+");
    const apiUrl = `https://api.github.com/search/repositories?q=${finalQuery}`;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API error (status ${response.status})`);
      }

      const data = await response.json();
      let items = data.items || [];

      // Extra filtering if multiple license filters were specified
      if (licenseFilters.size > 0) {
        items = items.filter((repo) => {
          const spdx = repo.license?.spdx_id?.toLowerCase();
          return spdx && licenseFilters.has(spdx);
        });
      }

      setRepos(items);
      if (items.length === 0) {
        setError("No repositories found with those filters.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch repositories. Please try again.");
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="table-container">
      <h2>GitHub C Projects by Keyword & License</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="e.g. mit, sorting, apache"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && repos.length > 0 && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Repository Name</th>
              <th>Description</th>
              <th>Last Modified</th>
              <th>License</th>
              <th>Forks</th>
              <th>Stars</th>
              <th>Language</th>
              <th>Origin</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repository) => (
              <tr key={repository.id}>
                <td>
                  <a
                    href={repository.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repository.name}
                  </a>
                </td>
                <td>{repository.description || "Not Available"}</td>
                <td>
                  {repository.updated_at
                    ? new Date(repository.updated_at).toLocaleDateString()
                    : "Not Available"}
                </td>
                <td>{repository.license?.name || "Not Available"}</td>
                <td>{repository.forks_count}</td>
                <td>{repository.stargazers_count}</td>
                <td>{repository.language || "C"}</td>
                <td>{repository.owner?.login || "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GitHubCProjects;
