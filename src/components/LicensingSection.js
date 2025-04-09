const LicensingSection = ({ repo }) => (
  <div>
    <p>
      <strong>License Name:</strong>{" "}
      {repo.license?.name || "No license info available."}
    </p>
    <p>
      <strong>SPDX ID:</strong> {repo.license?.spdx_id || "N/A"}
    </p>
  </div>
);

export default LicensingSection;
