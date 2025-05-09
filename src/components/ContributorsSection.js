import React, { useState, useEffect } from "react";

const ContributorsSection = ({ repo }) => {
  const [contributors, setContributors] = useState([]);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#374151", // gray-700
  };

  const labelStyle = { fontWeight: 500 };
  const valueStyle = { color: "#1f2937" };
  const containerStyle = {};

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    fontSize: "14px",
  };

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(repo.contributors_url);
        const data = await response.json();
        setContributors(data.slice(0, 5)); // Show top 5
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    };

    fetchContributors();
  }, [repo.contributors_url]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h4
        style={{
          fontSize: "1.125rem",
          color: "#24292e",
          borderBottom: "1px solid #d0d7de",
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
        }}>
        Top Contributors
      </h4>

      {contributors.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                gap: "0.75rem",
              }}>
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid #d0d7de",
                }}
              />
              <div>
                <a
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: 600,
                    color: "#0969da",
                    textDecoration: "none",
                  }}>
                  {contributor.login}
                </a>
                <div style={{ fontSize: "0.875rem", color: "#57606a" }}>
                  {contributor.contributions} contributions
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#57606a" }}>Loading contributors...</p>
      )}

      <a
        href={`${repo.html_url}/graphs/contributors`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          color: "#0969da",
          fontSize: "0.875rem",
          textDecoration: "underline",
        }}>
        View all contributors on GitHub →
      </a>
      <div style={containerStyle}>
        <div>
          <h3 style={sectionTitleStyle}>Maintainer</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}>
            <img
              src={repo.owner?.avatar_url}
              alt="Maintainer"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "1px solid #ccc",
              }}
            />
            <div style={{ fontSize: "14px" }}>
              <p>
                <span style={labelStyle}>Name:</span>{" "}
                <a
                  href={repo.owner?.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "none" }}>
                  {repo.owner?.login}
                </a>{" "}
                ({repo.owner?.type})
              </p>
              <p>
                <span style={labelStyle}>Site Admin:</span>{" "}
                {repo.owner?.site_admin ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 style={sectionTitleStyle}>Project Origin</h3>
          <div style={gridStyle}>
            <p>
              <span style={labelStyle}>Created:</span>{" "}
              <span style={valueStyle}>{formatDate(repo.created_at)}</span>
            </p>
            <p>
              <span style={labelStyle}>Last Updated:</span>{" "}
              <span style={valueStyle}>{formatDate(repo.updated_at)}</span>
            </p>
            <p>
              <span style={labelStyle}>Last Commit:</span>{" "}
              <span style={valueStyle}>{formatDate(repo.pushed_at)}</span>
            </p>
            <p>
              <span style={labelStyle}>Primary Language:</span>{" "}
              <span style={valueStyle}>{repo.language || "N/A"}</span>
            </p>

            <p>
              <span style={labelStyle}>Default Branch:</span>{" "}
              <span style={valueStyle}>{repo.default_branch}</span>
            </p>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h3 style={sectionTitleStyle}>Community & Adoption</h3>
          <div style={gridStyle}>
            <p>
              <span style={labelStyle}>Stars:</span>
              {repo.stargazers_count}
            </p>
            <p>
              <span style={labelStyle}>Forks:</span>
              {repo.forks_count}
            </p>
            <p>
              <span style={labelStyle}>Open Issues:</span>{" "}
              {repo.open_issues_count}
            </p>
            <p>
              <span style={labelStyle}>Has Discussions:</span>{" "}
              {repo.has_discussions ? "Yes" : "No"}
            </p>
            <p>
              <span style={labelStyle}>Has Wiki:</span>{" "}
              {repo.has_wiki ? "Yes" : "No"}
            </p>
            <p>
              <span style={labelStyle}>Is Template:</span>{" "}
              {repo.is_template ? "Yes" : "No"}
            </p>
            <p>
              <span style={labelStyle}>Contributor Graph:</span>{" "}
              <a
                href={`${repo.html_url}/graphs/contributors`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2563eb", textDecoration: "none" }}>
                View on GitHub
              </a>
            </p>
            <p>
              <span style={labelStyle}>Topics:</span>{" "}
              {repo.topics?.join(", ") || "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorsSection;
