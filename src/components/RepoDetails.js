import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RepoDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const repo = state?.repo;
  const [activeSection, setActiveSection] = useState("description");

  if (!repo) {
    return <div style={{ padding: "2rem", color: "#ccc" }}>No repository data available.</div>;
  }

  const linkStyle = {
    color: "#4dabf7",
    textDecoration: "underline",
    fontSize: "14px",
  };

  const sections = {
    description: {
      label: "Description",
      content: (
        <div>
          <h3>{repo.full_name}</h3>
          <p>{repo.description || "No description provided."}</p>
          <p><strong>Language:</strong> {repo.language || "N/A"}</p>
          <p><strong>Visibility:</strong> {repo.private ? "Private" : "Public"}</p>
          <p><strong>Stars:</strong> {repo.stargazers_count}</p>
          <p><strong>Watchers:</strong> {repo.watchers_count}</p>
          <p><strong>Forks:</strong> {repo.forks_count}</p>
          <p><strong>Created At:</strong> {new Date(repo.created_at).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(repo.updated_at).toLocaleString()}</p>
        </div>
      ),
    },
    contributors: {
      label: "Contributors",
      content: (
        <div>
          <p>To view contributors, check GitHub:</p>
          <a
            href={`${repo.html_url}/graphs/contributors`}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            View Contributors
          </a>
        </div>
      ),
    },
    licensing: {
      label: "Licensing",
      content: (
        <div>
          <p><strong>License Name:</strong> {repo.license?.name || "No license info available."}</p>
          <p><strong>SPDX ID:</strong> {repo.license?.spdx_id || "N/A"}</p>
        </div>
      ),
    },
    extensibility: {
      label: "Extension and Pluggability",
      content: (
        <div>
          <p>{repo.topics?.length ? repo.topics.join(", ") : "No keywords or topics provided."}</p>
        </div>
      ),
    },
    support: {
      label: "Support",
      content: (
        <div>
          <p><strong>Issues Enabled:</strong> {repo.has_issues ? "Yes" : "No"}</p>
          <p><strong>Open Issues:</strong> {repo.open_issues_count}</p>
          <p><strong>Has Projects:</strong> {repo.has_projects ? "Yes" : "No"}</p>
          <p><strong>Has Wiki:</strong> {repo.has_wiki ? "Yes" : "No"}</p>
        </div>
      ),
    },
    dependencyGraph: {
      label: "Dependency Graph",
      content: (
        <div>
          <p>You can view this repo's dependencies directly on GitHub:</p>
          <a
            href={`${repo.html_url}/network/dependencies`}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            View Dependency Graph
          </a>
        </div>
      ),
    },
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "#f0f0f0",
      fontFamily: "Segoe UI, sans-serif",
    },
    sidebarWrapper: {
      display: "flex",
      flexDirection: "column",
      width: "250px",
      backgroundColor: "#1e1e1e",
      borderRight: "1px solid #333",
      padding: "1rem",
    },
    backButton: {
      fontSize: "0.95rem",
      fontWeight: "500",
      color: "#4dabf7",
      cursor: "pointer",
      marginBottom: "2rem",
    },
    sidebarItem: (isActive) => ({
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: isActive ? "#333" : "transparent",
      fontWeight: isActive ? "600" : "400",
      color: isActive ? "#4dabf7" : "#ccc",
      transition: "background-color 0.2s",
    }),
    contentArea: {
      flex: 1,
      padding: "2rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#fff",
    },
    sectionContent: {
      fontSize: "1rem",
      lineHeight: "1.6",
      color: "#ddd",
    },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebarWrapper}>
        <div style={styles.backButton} onClick={() => navigate("/")}>
          ← Back
        </div>

        {Object.entries(sections).map(([key, section]) => (
          <div
            key={key}
            style={styles.sidebarItem(key === activeSection)}
            onClick={() => setActiveSection(key)}
          >
            {section.label}
          </div>
        ))}
      </aside>

      <main style={styles.contentArea}>
        <h2 style={styles.sectionTitle}>{sections[activeSection].label}</h2>
        <div style={styles.sectionContent}>{sections[activeSection].content}</div>
      </main>
    </div>
  );
};

export default RepoDetails;
