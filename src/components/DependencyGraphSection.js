import React, { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import html2canvas from "html2canvas";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

// const renderNodeLabel = ({ nodeDatum }) => (
//   <g>
//     <text
//       textAnchor="middle"
//       y={-10}
//       fontSize={12}
//       fontWeight="bold"
//       initialDepth={Infinity} // <- expand all nodes
//       fill="#ffffff">
//       {nodeDatum.name}
//     </text>
//   </g>
// );

const renderNodeLabel = ({ nodeDatum }) => (
  <g
    onClick={() => window.open("https://www.google.com", "_blank")}
    style={{ cursor: "pointer" }}>
    <rect
      width="200"
      height="80"
      x="-80"
      y="-30"
      rx="10"
      ry="10"
      fill="#FAF0CA"
      //  stroke="#0D3B66"
      strokeWidth="1.5"
    />
    <text
      textAnchor="middle"
      y="-10"
      fontSize={14}
      //fontWeight="bold"
      fill="#0D3B66">
      {nodeDatum.name}
    </text>
    <text textAnchor="middle" y="10" fontSize={10} fill="#555">
      {nodeDatum.license || "Unknown license"}
    </text>
    <text textAnchor="middle" y="25" fontSize={10} fill="#888">
      Forks: {nodeDatum.forks || 0}
    </text>
  </g>
);

const DependencyGraphSection = ({ repo }) => {
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const treeContainer = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const treeWrapperRef = useRef(null);

  const dependencyData = {
    name: "example-org/my-c-project",
    description: "A sample C project that uses libcurl and math libraries.",
    lastModified: "2025-04-01",
    license: "MIT License",
    forks: 57,
    dependencies: {
      name: "my_c_project",
      description: "Main binary built from project source code.",
      lastModified: "2025-04-01",
      license: "MIT License",
      forks: 57,
      children: [
        {
          name: "libcurl.so",
          description:
            "Client-side URL transfer library supporting FTP, HTTP, etc.",
          lastModified: "2024-11-10",
          license: "MIT",
          forks: 210,
          children: [
            {
              name: "libssl.so",
              description: "OpenSSL implementation of SSL and TLS protocols.",
              lastModified: "2024-10-01",
              license: "Apache 2.0",
              forks: 300,
              children: [
                {
                  name: "libcrypto.so",
                  description: "Core cryptographic functions from OpenSSL.",
                  lastModified: "2024-09-15",
                  license: "Apache 2.0",
                  forks: 280,
                },
                {
                  name: "zlib.so",
                  description: "Compression library for data streams.",
                  lastModified: "2024-08-12",
                  license: "Zlib",
                  forks: 150,
                },
              ],
            },
            {
              name: "libz.so",
              description: "Alternate build of zlib.",
              lastModified: "2024-08-14",
              license: "Zlib",
              forks: 120,
            },
          ],
        },
        {
          name: "libm.so",
          description:
            "Math library providing mathematical functions like sin, cos, etc.",
          lastModified: "2024-07-10",
          license: "GPL",
          forks: 75,
          children: [
            {
              name: "libc.so",
              description: "C standard library implementation.",
              lastModified: "2024-06-20",
              license: "LGPL",
              forks: 600,
            },
          ],
        },
        {
          name: "libpthread.so",
          description: "POSIX thread library used for multithreading.",
          lastModified: "2024-05-01",
          license: "LGPL",
          forks: 180,
        },
      ],
    },
  };
  const sampleTree = {
    name: "Main Program",
    description: "This is the root C executable.",
    license: "MIT",
    lastModified: "2025-01-01",
    forks: 50,
    children: [
      {
        name: "libmath.so",
        description: "Math library for basic arithmetic.",
        license: "GPL",
        lastModified: "2024-12-10",
        forks: 20,
        children: [
          {
            name: "libc.so",
            description: "Standard C library.",
            license: "LGPL",
            lastModified: "2024-11-15",
            forks: 100,
          },
        ],
      },
      {
        name: "libnetwork.so",
        description: "Handles TCP/IP operations.",
        license: "Apache 2.0",
        lastModified: "2024-11-05",
        forks: 30,
      },
      {
        name: "libthreads.so",
        description: "POSIX threading support.",
        license: "LGPL",
        lastModified: "2024-10-01",
        forks: 15,
      },
    ],
  };

  // useEffect(() => {
  //   const fetchDependencies = async () => {
  //     try {
  //       const owner = repo.owner.login;
  //       const name = repo.name;

  //       const treeRes = await fetch(
  //         `https://api.github.com/repos/${owner}/${name}/git/trees/HEAD?recursive=1`,
  //         { headers }
  //       );
  //       if (!treeRes.ok) throw new Error("Failed to fetch repo tree");

  //       const treeData = await treeRes.json();
  //       const allFiles = treeData.tree;

  //       const npmFiles = allFiles.filter((f) =>
  //         ["package.json", "package-lock.json"].includes(
  //           f.path.split("/").pop()
  //         )
  //       );

  //       const actionYmlFiles = allFiles.filter(
  //         (f) =>
  //           f.path.startsWith(".github/workflows/") && f.path.endsWith(".yml")
  //       );

  //       console.log(
  //         "📦 NPM dependency files:",
  //         npmFiles.map((f) => f.path)
  //       );
  //       console.log(
  //         "⚙️ GitHub Actions files:",
  //         actionYmlFiles.map((f) => f.path)
  //       );

  //       const collectedDeps = new Set();

  //       // ─── Parse package.json and package-lock.json ────────────────────────────────
  //       for (const file of npmFiles) {
  //         const rawUrl = `https://raw.githubusercontent.com/${owner}/${name}/HEAD/${file.path}`;
  //         const fileRes = await fetch(rawUrl);
  //         if (!fileRes.ok) continue;

  //         const text = await fileRes.text();

  //         try {
  //           const json = JSON.parse(text);

  //           if (file.path.endsWith("package.json")) {
  //             Object.keys(json.dependencies || {}).forEach((dep) => {
  //               collectedDeps.add(dep);
  //             });
  //           } else if (file.path.endsWith("package-lock.json")) {
  //             if (json.dependencies) {
  //               Object.keys(json.dependencies).forEach((dep) =>
  //                 collectedDeps.add(`${dep} (transitive)`)
  //               );
  //             } else if (json.packages) {
  //               Object.keys(json.packages).forEach((pkgPath) => {
  //                 const pkg = json.packages[pkgPath];
  //                 if (pkg.dependencies) {
  //                   Object.keys(pkg.dependencies).forEach((dep) =>
  //                     collectedDeps.add(`${dep} (transitive)`)
  //                   );
  //                 }
  //               });
  //             }
  //           }
  //         } catch (err) {
  //           console.warn(`⚠️ Failed to parse ${file.path}:`, err);
  //           collectedDeps.add(`⚠️ Error parsing ${file.path}`);
  //         }
  //       }

  //       // ─── Parse GitHub Action dependencies from YML ──────────────────────────────
  //       for (const file of actionYmlFiles) {
  //         const rawUrl = `https://raw.githubusercontent.com/${owner}/${name}/HEAD/${file.path}`;
  //         const fileRes = await fetch(rawUrl);
  //         if (!fileRes.ok) continue;

  //         const yml = await fileRes.text();
  //         const actionMatches = [...yml.matchAll(/uses:\s*(\S+)/g)];

  //         actionMatches.forEach((match) => {
  //           const action = match[1].trim().replace(/^['"]|['"]$/g, "");
  //           collectedDeps.add(`${action} (GitHub Action)`);
  //         });
  //       }

  //       setDependencies(Array.from(collectedDeps).sort());
  //     } catch (err) {
  //       console.error("❌ Dependency fetch error:", err);
  //       setDependencies(["❌ Failed to fetch dependencies"]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDependencies();
  // }, [repo]);

  const handleDownload = async () => {
    if (!treeWrapperRef.current) return;

    const canvas = await html2canvas(treeWrapperRef.current, {
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = "dependency-graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  useEffect(() => {
    const dimensions = treeContainer.current.getBoundingClientRect();
    setTranslate({
      x: dimensions.width / 2,
      y: dimensions.height / 8,
    });
  }, []);

  return (
    // <div style={{ marginTop: "1rem" }}>
    //   <h4 style={{ color: "#C9D1D9", marginBottom: "0.5rem" }}>
    //     Dependencies (npm + GitHub Actions)
    //   </h4>

    //   {loading ? (
    //     <p>Loading dependencies...</p>
    //   ) : dependencies.length === 0 ? (
    //     <p>
    //       No <code>package.json</code>, <code>package-lock.json</code>, or
    //       GitHub Actions found.{" "}
    //       <a
    //         href={`${repo.html_url}/network/dependencies`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         style={{ color: "#4dabf7", textDecoration: "underline" }}>
    //         View GitHub's full dependency graph
    //       </a>
    //     </p>
    //   ) : (
    //     <ul style={{ fontSize: "14px", color: "#8B949E" }}>
    //       {dependencies.map((dep, i) => (
    //         <li key={i}>{dep}</li>
    //       ))}
    //     </ul>
    //   )}

    //   <a
    //     href={`${repo.html_url}/network/dependencies`}
    //     target="_blank"
    //     rel="noopener noreferrer"
    //     style={{
    //       color: "#4dabf7",
    //       textDecoration: "underline",
    //       fontSize: "14px",
    //       display: "block",
    //       marginTop: "1rem",
    //     }}>
    //     View GitHub's full dependency graph
    //   </a>
    // </div>
    <div>
      <div style={{ marginBottom: "1rem", textAlign: "right" }}>
        <button
          onClick={handleDownload}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0D3B66",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>
          Download Graph as PNG
        </button>
      </div>
      <div
        id="treeWrapper"
        style={{ width: "70vw", height: "80vh", backgroundColor: "white" }}
        ref={treeWrapperRef}>
        <div
          id="treeWrapper"
          s
          style={{ width: "70vw", height: "80vh", backgroundColor: "white" }}
          ref={treeContainer}>
          {/* <Tree
          data={dependencyData}
          translate={translate}
          orientation="vertical"
          collapsible={false}
          renderCustomNodeElement={renderNodeLabel}
          onNodeClick={(node) => setSelectedNode(node.data)}
          pathFunc="step"
        /> */}
          <Tree
            data={[sampleTree]}
            initialDepth={Infinity}
            collapsible={false}
            translate={translate}
            orientation="vertical"
            renderCustomNodeElement={renderNodeLabel}
            onNodeClick={(node) => setSelectedNode(node.data)}
            pathFunc="diagonal"
            pathClassFunc={() => "custom-link"}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            styles={{
              links: {
                stroke: "#4dabf7 !important",
                strokeWidth: 2,
              },
            }}
          />
        </div>
      </div>
      {selectedNode && (
        <div className="p-4 shadow rounded-xl bg-white w-80 text-sm leading-6">
          <h3 className="font-bold text-lg mb-2">{selectedNode.name}</h3>
          <p>
            <strong>Description:</strong> {selectedNode.description}
          </p>
          <p>
            <strong>Last Modified:</strong> {selectedNode.lastModified}
          </p>
          <p>
            <strong>License:</strong> {selectedNode.license}
          </p>
          <p>
            <strong>Forks:</strong> {selectedNode.forks}
          </p>
        </div>
      )}
    </div>
  );
};

export default DependencyGraphSection;
