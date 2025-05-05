const LicensingSection = ({ repo }) => {
  const license = repo.license;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h4
        style={{
          fontSize: "1.125rem",
          color: "#24292e",
          borderBottom: "1px solid #d0d7de",
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
        }}>
        Licensing Information
      </h4>

      {license ? (
        <div style={{ lineHeight: "1.6", color: "#24292e" }}>
          <p>
            <strong>License Name:</strong> {license.name}
          </p>
          <p>
            <strong>SPDX ID:</strong> {license.spdx_id || "N/A"}
          </p>
          <p>
            <strong>License URL:</strong>{" "}
            {license.url ? (
              <a
                href={license.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0969da", textDecoration: "underline" }}>
                View Full License
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </div>
      ) : (
        <p style={{ color: "#57606a" }}>
          This repository does not have a license specified.
        </p>
      )}

      <p style={{ fontSize: "0.875rem", color: "#57606a", marginTop: "1rem" }}>
        Learn more about licensing at{" "}
        <a
          href="https://choosealicense.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0969da" }}>
          choosealicense.com
        </a>
      </p>
    </div>
  );
};

export default LicensingSection;
