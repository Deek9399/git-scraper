import React, { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import html2canvas from "html2canvas";
import RepoTreeVertical from "./RepoTreeVertical";

// const renderNodeLabel = ({ nodeDatum }) => (
//   <g
//     onClick={() => window.open("https://www.google.com", "_blank")}
//     style={{ cursor: "pointer" }}>
//     <rect
//       width="300"
//       height="80"
//       x="-80"
//       y="-30"
//       rx="10"
//       ry="10"
//       fill="#edeef0"
//       //  stroke="#0D3B66"
//       strokeWidth="0.5"
//     />
//     <text
//       textAnchor="middle"
//       y="-10"
//       fontSize={14}
//       //fontWeight="bold"
//       fill="#0D3B66">
//       {nodeDatum.name}
//     </text>
//     <text textAnchor="middle" y="10" fontSize={10} fill="#555">
//       {nodeDatum.license || "Unknown license"}
//     </text>
//     <text textAnchor="middle" y="25" fontSize={10} fill="#888">
//       Forks: {nodeDatum.forks || 0}
//     </text>
//   </g>
// );

const renderNodeLabel = ({ nodeDatum, toggleNode }) => (
  <g style={{ cursor: "pointer" }}>
    {/* Circle that toggles node */}
    <circle
      r="20"
      fill="#edeef0"
      stroke="#0D3B66"
      strokeWidth="1"
      onClick={toggleNode}
    />

    {/* Group for text, clicking it opens external link */}
    <g onClick={() => window.open("https://www.google.com", "_blank")}>
      <text textAnchor="middle" y="-30" fontSize={14} fill="#0D3B66">
        {nodeDatum.name}
      </text>
      <text textAnchor="middle" y="35" fontSize={10} fill="#555">
        {nodeDatum.license || "Unknown license"}
      </text>
      <text textAnchor="middle" y="50" fontSize={10} fill="#888">
        Forks: {nodeDatum.forks || 0}
      </text>
      {nodeDatum.attributes?.department && (
        <text textAnchor="middle" y="65" fontSize={10} fill="#444">
          Department: {nodeDatum.attributes.department}
        </text>
      )}
    </g>
  </g>
);

const DependencyGraphSection = ({ repo, dependencies, loading }) => {
  console.log("11111111111", dependencies, "22222222", loading);
  const treeContainer = useRef(null);
  const [translate, setTranslate] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const treeWrapperRef = useRef(null);
  const isTreeEmpty =
    !dependencies || Object.keys(dependencies).length === 0 || !translate;

  console.log("📐 translate:", translate);
  console.log("🧠 isTreeEmpty:", isTreeEmpty);

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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (treeWrapperRef.current && !translate && !loading && !error) {
      const dimensions = treeWrapperRef.current.getBoundingClientRect();

      // Defensive: ensure dimensions are valid numbers
      if (dimensions.width && dimensions.height) {
        setTranslate({
          x: dimensions.width / 2,
          y: 100,
        });
      }
    }
  }, [treeWrapperRef.current, loading, error, translate]);

  return (
    <div>
      {/* <div style={{ marginBottom: "1rem", textAlign: "right" }}>
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
        ref={treeWrapperRef}
        style={{
          width: "70vw",
          height: "90vh",
          backgroundColor: "white",
          overflow: "auto",
          position: "relative",
          whiteSpace: "nowrap",
        }}>
        {loading ? (
          <div>Loading tree...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : !translate ? (
          <div>Calculating layout...</div>
        ) : (
          <Tree
            data={[dependencies]}
            initialDepth={Infinity}
            collapsible={true}
            translate={translate}
            orientation="horizontal"
            renderCustomNodeElement={renderNodeLabel}
            onNodeClick={(node) => setSelectedNode(node.data)}
            pathFunc="diagonal"
            pathClassFunc={() => "custom-link"}
            separation={{ siblings: 1, nonSiblings: 2 }}
            styles={{
              links: {
                stroke: "#4dabf7 !important",
                strokeWidth: 2,
              },
            }}
          />
        )}
      </div>

      {selectedNode && (
        <div className="p-4 shadow rounded-xl bg-white w-80 text-sm leading-6 mt-4">
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
      )} */}

      <RepoTreeVertical data={dependencies} loading={loading} />
    </div>
  );
};

export default DependencyGraphSection;
