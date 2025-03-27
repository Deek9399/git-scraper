import React, { useState, useEffect } from "react";
import "./index.css"; 

const GitHubCProjects = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/search/repositories?q=language:C"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setRepos(data.items);
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchRepos();
  }, []);

  return (
    <div className="table-container">
      <h2>GitHub C Projects</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Repository Name</th>
            <th>Description</th>
            <th>Last Modified Date</th>
            <th>License Type</th>
            <th>Forks Count</th>
            <th>Origin&Pedigree</th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repository) => (
            <tr key={repository.id}>
              <td>
                <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                  {repository.name}
                </a>
              </td>
              <td>{repository.description || "Not Available"}</td>
              <td>{repository.updated_at || "Not Available"}</td>
              <td>{repository.license ? repository.license.name : "Not Available"}</td>
              <td>{repository.forks_count}</td>
              <td>{repository.owner ? repository.owner.login : "Unknown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GitHubCProjects;
