
import React, { useEffect, useState } from "react";

const DependencyGraphSection = ({ repo }) => {
  const [dependencies, setDependencies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      setLoading(true);
      setError(null);
      try {
        const owner = repo.owner.login;
        const name = repo.name;
        const res = await fetch(
          `http://localhost:3000/scrape-dependencies/${owner}/${name}`
        );

        if (!res.ok) throw new Error("Failed to fetch dependencies");

        const data = await res.json();
        setDependencies(data);
      } catch (err) {
        console.error("❌ Error:", err);
        setError("Failed to load dependency data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDependencies();
  }, [repo]);

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1rem",
        backgroundColor: "#0D1117",
        color: "#C9D1D9",
        borderRadius: "8px",
      }}
    >
      <h4 style={{ color: "#58a6ff", marginBottom: "1rem" }}>
        Dependency Tree (from backend)
      </h4>

      {loading && <p>Loading dependencies...</p>}

      {error && <p style={{ color: "#F85149" }}>{error}</p>}

      {!loading && dependencies && (
        <>
          <pre
            style={{
              backgroundColor: "#161B22",
              padding: "1rem",
              borderRadius: "6px",
              fontSize: "13px",
              overflowX: "auto",
              maxHeight: "600px",
            }}
          >
            {JSON.stringify(dependencies, null, 2)}
          </pre>

          <a
            href={`${repo.html_url}/network/dependencies`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4dabf7",
              textDecoration: "underline",
              fontSize: "14px",
              display: "block",
              marginTop: "1rem",
            }}
          >
            View GitHub's full dependency graph
          </a>
        </>
      )}
    </div>
  );
};

export default DependencyGraphSection;
