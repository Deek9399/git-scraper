import React, { useState } from "react";

function RepoSearch() {
  const [searchTerm, setSearchTerm] = useState(""); //for the search term
  const [repos, setRepos] = useState([]); //for storing the repos
  const [error, setError] = useState(""); //for errors

  const handleSearch = () => {
    if (!searchTerm) {
      alert("Please enter a search term");
      return;
    }

    const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}&per_page=10&page=1`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.items || data.items.length === 0) {
          setRepos([]);
          setError("No repositories found");
          return;
        }
        setRepos(data.items);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching:", error);
        setRepos([]);
        setError("Failed to fetch repositories. Please try again.");
      });
  };

  return (
    <div>
      <h1>GitHub Scraper</h1>
      <input
        type="text"
        placeholder="Search for a repository..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>{error}</p>}

      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <span> - ⭐ {repo.stargazers_count}</span>
            <span> - 📝 {repo.license ? repo.license.name : "No License"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RepoSearch;
