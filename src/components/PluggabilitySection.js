const PluggabilitySection = ({ repo }) => {
  console.log("111111111", repo);
  let score = 0;

  // Calculate score based on stars
  if ((repo.stargazers_count ?? 0) > 1000) {
    score += 60;
  } else if ((repo.stargazers_count ?? 0) > 100) {
    score += 40;
  } else if ((repo.stargazers_count ?? 0) > 10) {
    score += 20;
  }

  // Calculate score based on forks
  if ((repo.forks_count ?? 0) > 1000) {
    score += 15;
  } else if ((repo.forks_count ?? 0) > 100) {
    score += 10;
  } else if ((repo.forks_count ?? 0) > 10) {
    score += 5;
  }

  // Check description for pluggability-related keywords
  const description = repo.description ? repo.description.toLowerCase() : "";

  if (description.includes("plugin")) {
    score += 5;
  }
  if (description.includes("api")) {
    score += 5;
  }
  if (description.includes("extension")) {
    score += 5;
  }
  if (description.includes("modular")) {
    score += 5;
  }

  return (
    <div>
      <h3>Pluggability Breakdown</h3>
      <ul>
        <li>
          <strong>Stars:</strong> {repo.stargazers_count} {"=> "}
          {score >= 60
            ? "60 points"
            : score >= 40
            ? "40 points"
            : score >= 20
            ? "20 points"
            : "No points"}
        </li>
        <li>
          <strong>Forks:</strong> {repo.forks_count} {"=> "}
          {score >= 15
            ? "15 points"
            : score >= 10
            ? "10 points"
            : score >= 5
            ? "5 points"
            : "No points"}
        </li>
        <li>
          <strong>Description Keywords:</strong>
          <ul>
            {description.includes("plugin") && <li>Plugin {"=> "}5 points</li>}
            {description.includes("api") && <li>API {"=> "} 5 points</li>}
            {description.includes("extension") && (
              <li>Extension {"=> "} 5 points</li>
            )}
            {description.includes("modular") && (
              <li>Modular {"=> "} 5 points</li>
            )}
          </ul>
        </li>
      </ul>
      <p>
        <strong>Total Pluggability Score:</strong> {score}
      </p>
    </div>
  );
};

export default PluggabilitySection;
