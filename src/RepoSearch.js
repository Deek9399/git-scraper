// 📁 RepoSearch.js
import React, { useState } from "react";
import RepoTable from "./components/RepoTable";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

function RepoSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

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
        return Object.keys(json.dependencies || {}).join(", ") || "No dependencies found";
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
      return content.match(/find_package\((.*?)\)/gi)?.join(", ") || "No dependencies found";
    }
    if (filename.toLowerCase() === "makefile") {
      return content.match(/-l(\w+)/g)?.map((lib) => lib.replace("-l", "")).join(", ") || "No dependencies found";
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
      .map((kw) => kw.trim())
      .filter((kw) => kw.length > 0);

    if (rawKeywords.length > 6) {
      setDialogMessage("Keyword limit reached. Please enter no more than 6 keywords.");
      return;
    }

    const keywords = rawKeywords.join("+");
    const apiUrl = `https://api.github.com/search/repositories?q=${keywords}&per_page=10&page=1`;

    try {
      const response = await fetch(apiUrl, { headers });
      if (!response.ok) throw new Error(`Error! Status: ${response.status}`);

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        setRepos([]);
        setError("No repositories found");
        return;
      }

      const reposWithDependencies = await Promise.all(
        data.items.map(async (repo) => {
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
      setError("");
    } catch (error) {
      console.error("Error fetching:", error);
      setRepos([]);
      setError("Failed to fetch repositories. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0D1117", color: "#C9D1D9", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "Segoe UI, sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Web Scraper</h1>
      <p style={{ color: "#8B949E", textAlign: "center", maxWidth: "600px", marginBottom: "1.5rem" }}>
        Search open-source repositories by keyword and see what dependencies they're using.
      </p>

      {dialogMessage && (
        <div style={{ backgroundColor: "#21262D", border: "1px solid #30363D", color: "#F85149", padding: "0.75rem 1.25rem", borderRadius: "6px", marginBottom: "1rem", maxWidth: "600px", textAlign: "center" }}>
          {dialogMessage}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          style={{ padding: "0.6rem 1rem", fontSize: "1rem", borderRadius: "6px", border: "1px solid #30363D", backgroundColor: "#161B22", color: "#C9D1D9", outline: "none", minWidth: "320px" }}
          type="text"
          placeholder="Search for a repository..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          style={{ padding: "0.6rem 1.2rem", fontSize: "1rem", backgroundColor: "#238636", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          type="submit"
        >
          Search
        </button>
      </form>

      {error && <p>{error}</p>}
      {repos.length > 0 && <RepoTable repos={repos} />}
    </div>
  );
}

export default RepoSearch;
