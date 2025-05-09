const DescriptionSection = ({ repo }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div>
      <h3>
  <a
    href={repo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#0969DA", textDecoration: "none" }}
  >
    {repo.full_name}
  </a>
</h3>
      <p>{repo.description || "No description provided."}</p>
      <p>
        <strong>Language:</strong> {repo.language || "N/A"}
      </p>
      <p>
        <strong>Visibility:</strong> {repo.private ? "Private" : "Public"}
      </p>
      <p>
        <strong>Stars:</strong> {repo.stargazers_count}
      </p>
      <p>
        <strong>Watchers:</strong> {repo.watchers_count}
      </p>
      <p>
        <strong>Forks:</strong> {repo.forks_count}
      </p>
      <p>
        <strong>Created At:</strong> {formatDate(repo.created_at)}
      </p>
      <p>
        <strong>Last Updated:</strong> {formatDate(repo.updated_at)}
      </p>
      <p>
        <strong>Homepage:</strong>{" "}
        {repo.homepage ? (
          <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
            {repo.homepage}
          </a>
        ) : (
          "N/A"
        )}
      </p>
      <p>
        <strong>Topics:</strong>{" "}
        {repo.topics.length ? repo.topics.join(", ") : "None"}
      </p>
      <p>
        <strong>Open Issues:</strong> {repo.open_issues_count}
      </p>
      <p>
        <strong>Archived:</strong> {repo.archived ? "Yes" : "No"}
      </p>
      <p>
        <strong>Disabled:</strong> {repo.disabled ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default DescriptionSection;
