import React, { useState, useEffect } from "react";

const ContributorsSection = ({ repo }) => {
  const [contributors, setContributors] = useState([]);

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
        <ul style={{ listStyle: "none", padding: 0 }}>
          {contributors.map((contributor) => (
            <li
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
            </li>
          ))}
        </ul>
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
    </div>
  );
};

export default ContributorsSection;
