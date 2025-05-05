import React from "react";

const SupportSection = ({ repo }) => {
  const isOrg = repo.owner?.type === "Organization";
  const updatedDate = new Date(repo.updated_at).toLocaleDateString();
  const createdDate = new Date(repo.created_at).toLocaleDateString();
  const projectAgeYears = Math.floor(
    (Date.now() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24 * 365)
  );

  return (
    <div
      style={{
        padding: "20px",
        maxHeight: "90vh",
        overflowY: "auto",
        fontFamily: "Segoe UI, sans-serif",
        color: "#24292E",
        backgroundColor: "#F6F8FA",
        borderRadius: "8px",
      }}>
      <h3 style={{ color: "#0969DA", marginBottom: "1rem" }}>
        🛠️ Support & Maturity
      </h3>
      <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.8 }}>
        <li>
          <strong>🏢 Maintained by:</strong> {repo.owner?.login} (
          {isOrg ? "Organization" : "User"})
        </li>
        <li>
          <strong>📈 Installed Base:</strong> {repo.stargazers_count} stars,{" "}
          {repo.forks_count} forks
        </li>
        <li>
          <strong>📅 Created:</strong> {createdDate} ({projectAgeYears}+ years
          old)
        </li>
        <li>
          <strong>🔄 Last Updated:</strong> {updatedDate}
        </li>
        <li>
          <strong>📄 Default Branch:</strong>{" "}
          {repo.default_branch || "Not specified"}
        </li>
        <li>
          <strong>✅ Issues Enabled:</strong> {repo.has_issues ? "Yes" : "No"}
        </li>
        <li>
          <strong>💬 Discussions:</strong> {repo.has_discussions ? "Yes" : "No"}
        </li>
        <li>
          <strong>📚 Documentation:</strong>{" "}
          {repo.homepage ? (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0969DA", textDecoration: "none" }}>
              {repo.homepage}
            </a>
          ) : (
            "Not available"
          )}
        </li>
        <li>
          <strong>🌍 Web Help Available:</strong>{" "}
          {repo.topics?.length > 0 || repo.homepage ? "Likely yes" : "Limited"}
        </li>
        <li>
          <strong>💵 Paid Support:</strong>{" "}
          {isOrg ? "Possibly (based on organization)" : "Not officially listed"}
        </li>
      </ul>
    </div>
  );
};

export default SupportSection;
