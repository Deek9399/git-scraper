import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DescriptionSection from "./repoDetails/DescriptionSection";
import ContributorsSection from "./repoDetails/ContributorsSection";
import LicensingSection from "./repoDetails/LicensingSection";
import PluggabilitySection from "./repoDetails/PluggabilitySection";
import SupportSection from "./SupportSection";
import DependencyGraphSection from "./repoDetails/DependencyGraphSection";

//Extensibility Implementation
function calculateExtensibilityScore(repo) {
  let score = 0;
  if (repo.stargazers_count > 5000) score += 20;
  else if (repo.stargazers_count > 1000) score += 10;

  if (repo.forks_count > 1000) score += 20;
  else if (repo.forks_count > 300) score += 10;
  if (repo.watchers_count > 500) score += 10;

  const permissiveLicenses = ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause"];
  if (repo.license && permissiveLicenses.includes(repo.license.spdx_id)) {
    score += 15;
  }
  if (repo.dependencies && repo.dependencies.length > 0) {
    score += 25;
  }

  return Math.min(score, 100);
}

const RepoDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const repo = state?.repo;
  const [activeSection, setActiveSection] = useState("description");

  if (!repo) {
    return (
      <div style={{ padding: "2rem", color: "#ccc" }}>
        No repository data available.
      </div>
    );
  }

  const extensibilityScore = calculateExtensibilityScore(repo); //calculate extensibility

  const linkStyle = {
    color: "#4dabf7",
    textDecoration: "underline",
    fontSize: "14px",
  };

  const sections = {
    description: {
      label: "Description",
      content: <DescriptionSection repo={repo} />,
    },
    contributors: {
      label: "Contributors",
      content: <ContributorsSection repo={repo} />,
    },
    licensing: {
      label: "Licensing",
      content: <LicensingSection repo={repo} />,
    },
    extensibility: {
      label: "Extensibility",
      content: (
        <div>
          <h3>Extensibility Score: {extensibilityScore}/100</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Stars ({repo.stargazers_count}): {repo.stargazers_count > 5000 ? '+20' : repo.stargazers_count > 1000 ? '+10' : '+0'}</li>
            <li>Forks ({repo.forks_count}): {repo.forks_count > 1000 ? '+20' : repo.forks_count > 300 ? '+10' : '+0'}</li>
            <li>Watchers ({repo.watchers_count}): {repo.watchers_count > 500 ? '+10' : '+0'}</li>
            <li>License ({repo.license?.spdx_id || 'None'}): {repo.license && ["MIT","Apache-2.0","BSD-2-Clause","BSD-3-Clause"].includes(repo.license.spdx_id) ? '+15' : '+0'}</li>
            <li>Dependencies ({repo.dependencies?.length || 0}): {repo.dependencies && repo.dependencies.length > 0 ? '+25' : '+0'}</li>
          </ul>
        </div>
      ),
    },
    pluggability: {
      label: "Pluggability",
      content: <PluggabilitySection repo={repo} />,
    },
    support: {
      label: "Support",
      content: <SupportSection repo={repo} />,
    },
    dependencyGraph: {
      label: "Dependency Graph",
      content: <DependencyGraphSection repo={repo} />,
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
            onClick={() => setActiveSection(key)}>
            {section.label}
          </div>
        ))}
      </aside>

      <main style={styles.contentArea}>
        <h2 style={styles.sectionTitle}>{sections[activeSection].label}</h2>
        <div style={styles.sectionContent}>
          {sections[activeSection].content}
        </div>
      </main>
    </div>
  );
};

export default RepoDetails;
