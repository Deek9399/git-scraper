const ExtensibilitySection = ({ repo }) => (
  <div>
    <p>
      {repo.topics?.length
        ? repo.topics.join(", ")
        : "No keywords or topics provided."}
    </p>
  </div>
);

export default ExtensibilitySection;
