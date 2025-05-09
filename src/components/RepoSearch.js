import React, { useState, useEffect } from "react";
import RepoTable from "./RepoTable";
import GitHubLogo from "../assets/github-mark.svg";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

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

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

function RepoSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchRepoRootFiles = async (owner, repo) => {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/`,
      { headers }
    );
    if (!response.ok) return null;
    const files = await response.json();
    return files.filter((file) =>
      [
        "makefile",
        "cmakelists.txt",
        "package.json",
        "requirements.txt",
        "go.mod",
        "Cargo.toml",
        "pom.xml",
        "build.gradle",
      ].includes(file.name.toLowerCase())
    );
  };

  const fetchFileContent = async (owner, repo, path) => {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );
    if (!response.ok) return null;
    const data = await response.json();
    const decodedContent = atob(data.content);
    const dependencies = extractDependencies(path, decodedContent);
    return dependencies;
  };

  const extractDependencies = (filename, content) => {
    if (filename.toLowerCase() === "package.json") {
      try {
        const json = JSON.parse(content);
        return (
          Object.keys(json.dependencies || {}).join(", ") ||
          "No dependencies found"
        );
      } catch {
        return "Error parsing package.json";
      }
    }
    if (filename.toLowerCase() === "requirements.txt") {
      return (
        content
          .split("\n")
          .filter((line) => line && !line.startsWith("#"))
          .join(", ") || "No dependencies found"
      );
    }
    if (filename.toLowerCase() === "cmakelists.txt") {
      return (
        content.match(/find_package\((.*?)\)/gi)?.join(", ") ||
        "No dependencies found"
      );
    }
    if (filename.toLowerCase() === "makefile") {
      return (
        content
          .match(/-l(\w+)/g)
          ?.map((lib) => lib.replace("-l", ""))
          .join(", ") || "No dependencies found"
      );
    }
    return "Unsupported dependency format";
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      setDialogMessage("Please enter search keywords");
      return;
    }

    const rawKeywords = searchTerm
      .split(",")
      .map((kw) => kw.trim().toLowerCase())
      .filter((kw) => kw.length > 0);

    if (rawKeywords.length > 6) {
      setDialogMessage(
        "Keyword limit reached. Please enter no more than 6 keywords."
      );
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

    const query = queryParts.join("+");
    const apiUrl = `https://api.github.com/search/repositories?q=${query}`;

    setLoading(true);
    setRepos([]);
    setError("");
    setDialogMessage("");

    try {
      const response = await fetch(apiUrl, { headers });
      if (!response.ok) throw new Error(`Error! Status: ${response.status}`);

      const data = await response.json();
      let items = data.items || [];

      if (licenseFilters.size > 0) {
        items = items.filter((repo) => {
          const spdx = repo.license?.spdx_id?.toLowerCase();
          return spdx && licenseFilters.has(spdx);
        });
      }

      if (items.length === 0) {
        setError("No repositories found");
        return;
      }

      const reposWithDependencies = await Promise.all(
        items.map(async (repo) => {
          const files = await fetchRepoRootFiles(repo.owner.login, repo.name);
          let dependencies = [];
          if (files) {
            dependencies = await Promise.all(
              files.map(async (file) => {
                const content = await fetchFileContent(
                  repo.owner.login,
                  repo.name,
                  file.path
                );
                return { name: file.name, content };
              })
            );
          }
          return { ...repo, dependencies };
        })
      );

      setRepos(reposWithDependencies);
      sessionStorage.setItem(
        "cachedRepos",
        JSON.stringify(reposWithDependencies)
      );
      sessionStorage.setItem("cachedSearchTerm", searchTerm);
    } catch (error) {
      console.error("Error fetching:", error);
      setRepos([]);
      setError("Failed to fetch repositories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedRepos = sessionStorage.getItem("cachedRepos");
    const cachedSearchTerm = sessionStorage.getItem("cachedSearchTerm");

    if (cachedRepos) setRepos(JSON.parse(cachedRepos));
    if (cachedSearchTerm) setSearchTerm(cachedSearchTerm);
  }, []);

  return (
    <div className="repo-search-container">
      <h1 className="repo-search-title">
        <img src={GitHubLogo} alt="GitHub Logo" className="github-logo" />
        Web Scraper
      </h1>
  
      <p className="repo-search-subtitle">
        Discover Open-Source projects and their Dependencies
      </p>
  
      {dialogMessage && (
        <div className="dialog-message">
          {dialogMessage}
        </div>
      )}
  
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="search-form"
      >
        <input
          type="text"
          placeholder="Search for a repository... (e.g. mit, sorting)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      
      {loading && (
      <div className="loading-container">
         <div className="dot-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
          <p className="loading-text">Fetching repositories...</p>
      </div>
)}

  
      {!loading && repos.length > 0 && <RepoTable repos={repos} />}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
export default RepoSearch;  