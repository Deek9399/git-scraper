const DependencyGraphSection = ({ repo }) => (
  <div>
    <p>You can view this repo's dependencies directly on GitHub:</p>
    <a
      href={`${repo.html_url}/network/dependencies`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#4dabf7",
        textDecoration: "underline",
        fontSize: "14px",
      }}>
      View Dependency Graph
    </a>
  </div>
);

export default DependencyGraphSection;
