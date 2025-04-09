const SupportSection = ({ repo }) => (
  <div>
    <p>
      <strong>Issues Enabled:</strong> {repo.has_issues ? "Yes" : "No"}
    </p>
    <p>
      <strong>Open Issues:</strong> {repo.open_issues_count}
    </p>
    <p>
      <strong>Has Projects:</strong> {repo.has_projects ? "Yes" : "No"}
    </p>
    <p>
      <strong>Has Wiki:</strong> {repo.has_wiki ? "Yes" : "No"}
    </p>
  </div>
);

export default SupportSection;
