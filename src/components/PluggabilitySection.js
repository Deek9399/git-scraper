import React from "react";

const calculatePlugabilityScore = (repo) => {
  let score = 0;
  const breakdown = [];

  const topics = repo.topics || [];
  const desc = repo.description?.toLowerCase() || "";
  const size = repo.size || 0;
  const stars = repo.stargazers_count ?? 0;
  const forks = repo.forks_count ?? 0;
  const compatibleLangs = ["JavaScript", "Python", "Java", "Go", "C++"];

  const add = (points, reason) => {
    score += points;
    breakdown.push({ points, reason });
  };

  // ⭐ Stars
  if (stars > 1000) add(15, "Highly popular (1000+ stars)");
  else if (stars > 100) add(10, "Popular (100+ stars)");
  else if (stars > 10) add(5, "Moderately known (10+ stars)");
  else add(0, "Low popularity");

  // 🍴 Forks
  if (forks > 1000) add(10, "Highly forked (1000+ forks)");
  else if (forks > 100) add(7, "Well forked (100+ forks)");
  else if (forks > 10) add(4, "Some reuse (10+ forks)");
  else add(0, "Low fork count");

  // 🔌 Library/Docker
  if (
    topics.some((t) => t.includes("lib") || t.includes("docker")) ||
    desc.includes("docker")
  )
    add(10, "Tagged/described as library or Docker");
  else add(0, "No library/docker tags");

  // 🛠 Modification requirement
  if (
    desc.includes("plug-and-play") ||
    desc.includes("wrapper") ||
    desc.includes("easy")
  )
    add(10, "Described as plug-and-play or wrapper");
  else add(0, "No plug-and-play indicators");

  // 🌐 Interface
  if (desc.includes("rest") || topics.includes("rest"))
    add(10, "REST interface detected");
  else if (topics.some((t) => ["soap", "socket", "message"].includes(t)))
    add(5, "Other interface type (SOAP/sockets/etc.)");
  else add(0, "No interface specified");

  // ⚙️ Size-based resource demand
  if (size < 50000) add(10, "Lightweight module (<50MB)");
  else if (size < 150000) add(7, "Moderate size (<150MB)");
  else add(4, "Large codebase");

  // 📘 Docs
  if (repo.homepage || repo.has_wiki) add(10, "Has homepage or wiki");
  else add(0, "No documentation found");

  // 📦 Precompiled or Installable
  if (
    topics.includes("binary") ||
    topics.includes("cli") ||
    topics.includes("install")
  )
    add(10, "Precompiled or installable");
  else add(0, "No installability indicators");

  // 💬 Language compatibility
  if (compatibleLangs.includes(repo.language))
    add(10, `Language is compatible (${repo.language})`);
  else add(0, `Language not in preferred list (${repo.language || "unknown"})`);

  // 🧩 Standalone Service
  if (
    topics.includes("rest") ||
    topics.includes("service") ||
    desc.includes("api")
  )
    add(5, "Likely a standalone deployable service");
  else add(0, "Not deployable as service");

  return {
    score: Math.min(score, 100),
    breakdown,
  };
};

const PlugabilitySection = ({ repo }) => {
  if (!repo)
    return <p style={{ color: "#57606a" }}>No repository data available.</p>;

  const { score, breakdown } = calculatePlugabilityScore(repo);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#24292e",
          borderBottom: "1px solid #d0d7de",
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
        }}>
          Plugability Score: {score}/100
      </h3>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#57606a",
          marginBottom: "1.5rem",
        }}>
        This score estimates how easily the repository can be integrated into
        your system based on its metadata and usage characteristics.
      </p>
      <details
        style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#57606a" }}>
        <summary
          style={{ cursor: "pointer", color: "#0969da", fontWeight: 500 }}>
          What does the Plugability Score mean?
        </summary>
        <div style={{ marginTop: "0.5rem" }}>
          The score is calculated based on:
          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li>⭐ Stars and 🍴 Forks — to reflect popularity and reuse</li>
            <li>🔌 Format — whether it's a library or Docker-ready</li>
            <li>
              🛠 Modification — whether it’s plug-and-play or requires changes
            </li>
            <li>🌐 Interface — REST, sockets, or SOAP support</li>
            <li>📘 Docs — presence of homepage or wiki</li>
            <li>📦 Installability — CLI or binary tags</li>
            <li>
              💬 Language — compatibility with JavaScript, Python, Java, etc.
            </li>
            <li>⚙️ Size — smaller modules score higher</li>
            <li>🧩 Deployability — can it run standalone?</li>
          </ul>
        </div>
      </details>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          width: "60%",
        }}>
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "0.75rem 1rem",
              border: "1px solid #d0d7de",
              borderRadius: "6px",
              backgroundColor: item.points === 0 ? "#fef2f2" : "#f6f8fa",
              color: item.points === 0 ? "#d73a49" : "#24292e",
              fontSize: "0.95rem",
            }}>
            <div style={{ maxWidth: "85%" }}>{item.reason}</div>
            <div style={{ fontWeight: 600 }}>
              {item.points > 0 ? `+${item.points}` : "+0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlugabilitySection;
