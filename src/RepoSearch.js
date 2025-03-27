import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

// 🔒 Replace this with your actual GitHub token

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;


const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

function RepoSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");

  // Fetch repo root files
  const fetchRepoRootFiles = async (owner, repo) => {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/`,
      { headers }
    );
    if (!response.ok) {
      console.error(`Error fetching files for ${repo}:`, response.status);
      return null;
    }

    const files = await response.json();
    console.log(`Files in ${repo}:`, files.map((f) => f.name));

    return files.filter((file) =>
      ["makefile", "cmakelists.txt", "package.json", "requirements.txt", "go.mod", "Cargo.toml", "pom.xml", "build.gradle"]
        .includes(file.name.toLowerCase())
    );
  };

  // Fetch and extract dependencies from a file
  const fetchFileContent = async (owner, repo, path) => {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );
    if (!response.ok) {
      console.error(`Error fetching ${path} for ${repo}:`, response.status);
      return null;
    }

    const data = await response.json();
    const decodedContent = atob(data.content);
    const dependencies = extractDependencies(path, decodedContent);

    console.log(`Dependencies in ${repo} -> ${path}:`, dependencies);
    return dependencies;
  };

  // Extract dependencies based on file type
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
      return content.split("\n").filter(line => line && !line.startsWith("#")).join(", ") || "No dependencies found";
    }

    if (filename.toLowerCase() === "cmakelists.txt") {
      return content.match(/find_package\((.*?)\)/gi)?.join(", ") || "No dependencies found";
    }

    if (filename.toLowerCase() === "makefile") {
      return content.match(/-l(\w+)/g)?.map(lib => lib.replace("-l", "")).join(", ") || "No dependencies found";
    }

    return "Unsupported dependency format";
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm) {
      alert("Please enter search keywords");
      return;
    }
  
    const rawKeywords = searchTerm
      .split(",")
      .map((kw) => kw.trim())
      .filter((kw) => kw.length > 0);
  
    // 🔒 Enforce max 6 keywords
    if (rawKeywords.length > 6) {
      alert("Keyword limit reached. Please enter no more than 6 keywords.");
      return;
    }
  
    const keywords = rawKeywords.join("+");
    const apiUrl = `https://api.github.com/search/repositories?q=${keywords}&per_page=10&page=1`;
  
    try {
      const response = await fetch(apiUrl, { headers });
      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }
  
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

            {repo.dependencies.length > 0 ? (
              <ul>
                {repo.dependencies.map((dep, i) => (
                  // <li key={i}>
                  //   <strong>{dep.name}</strong>: {dep.content || "No dependencies found"}
                  // </li>
                  
                  
                  <ul>
                    {dep.content.split(", ").map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                ))}
              </ul>
            ) : (
              <p>No dependencies found.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RepoSearch;
