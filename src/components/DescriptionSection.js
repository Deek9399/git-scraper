// DescriptionSection.jsx
const DescriptionSection = ({ repo }) => {
  console.log("Repository data:", repo);

  return (
    <div>
      <h3>{repo.full_name}</h3>
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
        <strong>Created At:</strong>{" "}
        {new Date(repo.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Last Updated:</strong>{" "}
        {new Date(repo.updated_at).toLocaleString()}
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
