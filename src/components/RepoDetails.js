import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DescriptionSection from "./DescriptionSection";
import ContributorsSection from "./ContributorsSection";
import LicensingSection from "./LicensingSection";
import PluggabilitySection from "./PluggabilitySection";
import SupportSection from "./SupportSection";
import DependencyGraphSection from "./DependencyGraphSection";

const RepoDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [dependencies, setDependencies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const repo = state?.repo;
  const [activeSection, setActiveSection] = useState("description");

  // if (!repo) {
  //   return (
  //     <div style={{ padding: "2rem", color: "#ccc" }}>
  //       No repository data available.
  //     </div>
  //   );
  // }
  console.log("11111111122222222", loading);
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
      label: "Extension",
      content: (
        <div>
          <p>
            {repo.topics?.length
              ? repo.topics.join(", ")
              : "No keywords or topics provided."}
          </p>
        </div>
      ),
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
