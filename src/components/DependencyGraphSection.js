import React, { useEffect, useState } from "react";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

const DependencyGraphSection = ({ repo }) => {
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const owner = repo.owner.login;
        const name = repo.name;

        const treeRes = await fetch(
          `https://api.github.com/repos/${owner}/${name}/git/trees/HEAD?recursive=1`,
          { headers }
        );
        if (!treeRes.ok) throw new Error("Failed to fetch repo tree");

        const treeData = await treeRes.json();
        const allFiles = treeData.tree;

        const npmFiles = allFiles.filter((f) =>
          ["package.json", "package-lock.json"].includes(f.path.split("/").pop())
        );

        const actionYmlFiles = allFiles.filter((f) =>
          f.path.startsWith(".github/workflows/") && f.path.endsWith(".yml")
        );

        console.log("📦 NPM dependency files:", npmFiles.map(f => f.path));
        console.log("⚙️ GitHub Actions files:", actionYmlFiles.map(f => f.path));

        const collectedDeps = new Set();

        // ─── Parse package.json and package-lock.json ────────────────────────────────
        for (const file of npmFiles) {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${name}/HEAD/${file.path}`;
          const fileRes = await fetch(rawUrl);
          if (!fileRes.ok) continue;

          const text = await fileRes.text();

          try {
            const json = JSON.parse(text);

            if (file.path.endsWith("package.json")) {
              Object.keys(json.dependencies || {}).forEach((dep) => {
                collectedDeps.add(dep);
              });
            } else if (file.path.endsWith("package-lock.json")) {
              if (json.dependencies) {
                Object.keys(json.dependencies).forEach((dep) =>
                  collectedDeps.add(`${dep} (transitive)`)
                );
              } else if (json.packages) {
                Object.keys(json.packages).forEach((pkgPath) => {
                  const pkg = json.packages[pkgPath];
                  if (pkg.dependencies) {
                    Object.keys(pkg.dependencies).forEach((dep) =>
                      collectedDeps.add(`${dep} (transitive)`)
                    );
                  }
                });
              }
            }
          } catch (err) {
            console.warn(`⚠️ Failed to parse ${file.path}:`, err);
            collectedDeps.add(`⚠️ Error parsing ${file.path}`);
          }
        }

        // ─── Parse GitHub Action dependencies from YML ──────────────────────────────
        for (const file of actionYmlFiles) {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${name}/HEAD/${file.path}`;
          const fileRes = await fetch(rawUrl);
          if (!fileRes.ok) continue;

          const yml = await fileRes.text();
          const actionMatches = [...yml.matchAll(/uses:\s*(\S+)/g)];

          actionMatches.forEach((match) => {
            const action = match[1].trim().replace(/^['"]|['"]$/g, "");
            collectedDeps.add(`${action} (GitHub Action)`);
          });
        }

        setDependencies(Array.from(collectedDeps).sort());
      } catch (err) {
        console.error("❌ Dependency fetch error:", err);
        setDependencies(["❌ Failed to fetch dependencies"]);
      } finally {
        setLoading(false);
      }
    };

    fetchDependencies();
  }, [repo]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h4 style={{ color: "#C9D1D9", marginBottom: "0.5rem" }}>
        Dependencies (npm + GitHub Actions)
      </h4>
  
      {loading ? (
        <p>Loading dependencies...</p>
      ) : dependencies.length === 0 ? (
        <p>
          No <code>package.json</code>, <code>package-lock.json</code>, or GitHub Actions found.{" "}
          <a
            href={`${repo.html_url}/network/dependencies`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4dabf7", textDecoration: "underline" }}
          >
            View GitHub's full dependency graph
          </a>
        </p>
      ) : (
        <ul style={{ fontSize: "14px", color: "#8B949E" }}>
          {dependencies.map((dep, i) => (
            <li key={i}>{typeof dep === "string" ? dep : `${dep.name} - ${dep.version}`}</li>
          ))}
        </ul>
      )}
  
      <button
        onClick={async () => {
          setLoading(true);
          try {
            const res = await fetch(
              `http://localhost:3000/scrape-dependencies/${repo.owner.login}/${repo.name}`
            );
            const data = await res.json();
            setDependencies(data.dependencies);
          } catch (err) {
            console.error("❌ Failed to fetch deep dependencies", err);
            setDependencies(["❌ Failed to fetch deep dependencies"]);
          } finally {
            setLoading(false);
          }
        }}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#238636",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        🔍 Run Deep Scan (GitHub Dependency Graph)
      </button>
  
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
    </div>
  );
  
};

export default DependencyGraphSection;
