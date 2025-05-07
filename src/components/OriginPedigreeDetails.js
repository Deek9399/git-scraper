import React from "react";

const OriginPedigreeDetails = ({ repo }) => {
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

  return (
    <div style={containerStyle}>
      <div>
        <h3 style={sectionTitleStyle}>👤 Maintainer</h3>
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
            <span style={labelStyle}>License:</span>{" "}
            {repo.license ? (
              <a
                href={repo.license.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2563eb", textDecoration: "none" }}>
                {repo.license.name}
              </a>
            ) : (
              "None"
            )}
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
            <span style={labelStyle}>Stars:</span> ⭐ {repo.stargazers_count}
          </p>
          <p>
            <span style={labelStyle}>Forks:</span> 🍴 {repo.forks_count}
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
  );
};

export default OriginPedigreeDetails;
