const ContributorsSection = ({ repo }) => (
  <div>
    <p>To view contributors, check GitHub:</p>
    <a
      href={`${repo.html_url}/graphs/contributors`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#4dabf7",
        textDecoration: "underline",
        fontSize: "14px",
      }}>
      View Contributors
    </a>
  </div>
);

export default ContributorsSection;
