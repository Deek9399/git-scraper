const ExtensibilitySection = ({ repo }) => {
  // Styles
  const scoreBoxStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    border: "1px solid #d0d7de",
    borderRadius: "6px",
    backgroundColor: "#f6f8fa",
    color: "#24292e",
    fontSize: "0.95rem",
  };

  const scoreValueStyle = {
    fontWeight: 600,
  };
  const calculateExtensibilityScore = (repo) => {
    let score = 0;

    if (repo.stargazers_count > 5000) score += 20;
    else if (repo.stargazers_count > 1000) score += 10;

    if (repo.forks_count > 1000) score += 20;
    else if (repo.forks_count > 300) score += 10;

    if (repo.watchers_count > 500) score += 10;

    const permissiveLicenses = [
      "MIT",
      "Apache-2.0",
      "BSD-2-Clause",
      "BSD-3-Clause",
    ];
    if (repo.license && permissiveLicenses.includes(repo.license.spdx_id)) {
      score += 15;
    }

    if (repo.dependencies && repo.dependencies.length > 0) {
      score += 25;
    }

    return Math.min(score, 100);
  };

  const extensibilityScore = calculateExtensibilityScore(repo);

  return (
    <div style={{ marginTop: "2rem", margin: "0 auto" }}>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#24292e",
          borderBottom: "1px solid #d0d7de",
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
        }}>
         Extensibility Score: {extensibilityScore}/100
      </h3>

      <p
        style={{
          fontSize: "0.95rem",
          color: "#57606a",
          marginBottom: "1.5rem",
        }}>
        The extensibility score reflects how open, forkable, and reusable this
        repository is based on its popularity, license, and modularity.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={scoreBoxStyle}>
          <div>
            <strong>Stars</strong> ({repo.stargazers_count})
          </div>
          <div style={scoreValueStyle}>
            {repo.stargazers_count > 5000
              ? "+20"
              : repo.stargazers_count > 1000
              ? "+10"
              : "+0"}
          </div>
        </div>

        <div style={scoreBoxStyle}>
          <div>
            <strong>Forks</strong> ({repo.forks_count})
          </div>
          <div style={scoreValueStyle}>
            {repo.forks_count > 1000
              ? "+20"
              : repo.forks_count > 300
              ? "+10"
              : "+0"}
          </div>
        </div>

        <div style={scoreBoxStyle}>
          <div>
            <strong>Watchers</strong> ({repo.watchers_count})
          </div>
          <div style={scoreValueStyle}>
            {repo.watchers_count > 500 ? "+10" : "+0"}
          </div>
        </div>

        <div style={scoreBoxStyle}>
          <div>
            <strong>License</strong> ({repo.license?.spdx_id || "None"})
          </div>
          <div style={scoreValueStyle}>
            {repo.license &&
            ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause"].includes(
              repo.license.spdx_id
            )
              ? "+15"
              : "+0"}
          </div>
        </div>

        <div style={scoreBoxStyle}>
          <div>
            <strong>Dependencies</strong> ({repo.dependencies?.length || 0})
          </div>
          <div style={scoreValueStyle}>
            {repo.dependencies && repo.dependencies.length > 0 ? "+25" : "+0"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensibilitySection;
