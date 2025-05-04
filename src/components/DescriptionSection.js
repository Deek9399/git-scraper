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
    </div>
  );
};

export default DescriptionSection;
