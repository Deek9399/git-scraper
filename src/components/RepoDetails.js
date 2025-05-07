import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DescriptionSection from "./DescriptionSection";
import ContributorsSection from "./ContributorsSection";
import LicensingSection from "./LicensingSection";
import PluggabilitySection from "./PluggabilitySection";
import SupportSection from "./SupportSection";
import DependencyGraphSection from "./DependencyGraphSection";
import ExtensibilitySection from "./ExtensibilitySection";
import OriginPedigreeDetails from "./OriginPedigreeDetails";

const RepoDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [dependencies, setDependencies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const repo = state?.repo;
  const [activeSection, setActiveSection] = useState("description");

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
    origin: {
      label: "Origin and Pedigree",
      content: <OriginPedigreeDetails repo={repo} />,
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
      content: <ExtensibilitySection repo={repo} />,
    },
    pluggability: {
      label: "Pluggability",
      content: <PluggabilitySection repo={repo} />,
    },
    support: {
      label: "Support",
      content: (
        <SupportSection
          repo={repo}
          dependencies={dependencies}
          loading={loading}
        />
      ),
    },
    dependencyGraph: {
      label: "Dependency Graph",
      content: (
        <DependencyGraphSection
          repo={repo}
          dependencies={dependencies}
          loading={loading}
        />
      ),
    },
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#ffffff", // GitHub uses white background
      color: "#24292e", // GitHub dark text
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    },
    sidebarWrapper: {
      display: "flex",
      flexDirection: "column",
      width: "250px",
      backgroundColor: "#f6f8fa", // GitHub sidebar gray
      borderRight: "1px solid #d0d7de", // GitHub subtle border
      padding: "1rem",
    },
    backButton: {
      fontSize: "0.95rem",
      fontWeight: "500",
      color: "#0969da", // GitHub link blue
      cursor: "pointer",
      marginBottom: "2rem",
    },
    sidebarItem: (isActive) => ({
      padding: "0.75rem 1rem",
      borderRadius: "6px",
      cursor: "pointer",
      backgroundColor: isActive ? "#eaeef2" : "transparent",
      fontWeight: isActive ? "600" : "400",
      color: isActive ? "#0969da" : "#57606a", // active vs neutral
      transition: "background-color 0.2s, color 0.2s",
    }),
    contentArea: {
      flex: 1,
      padding: "2rem",
      backgroundColor: "#ffffff",
    },
    sectionTitle: {
      fontSize: "1.5rem", // ~20px
      fontWeight: 600,
      color: "#24292e", // GitHub dark gray
      paddingBottom: "0.25rem",
      marginBottom: "1rem",
      borderBottom: "1px solid #e1e4e8", // subtle border
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    },
    sectionContent: {
      fontSize: "1rem",
      lineHeight: "1.6",
      color: "#24292e",
    },
  };

  useEffect(() => {
    if (!repo) return;
    const fetchDependencies = async () => {
      setLoading(true);
      setError(null);
      try {
        const owner = repo.owner.login;
        const name = repo.name;
        const res = await fetch(
          `http://localhost:3000/scrape-dependencies/${owner}/${name}`
        );

        if (!res.ok) throw new Error("Failed to fetch dependencies");

        const data = await res.json();
        setDependencies(data);
      } catch (err) {
        console.error("❌ Error:", err);
        setError("Failed to load dependency data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDependencies();
  }, [repo]);

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
