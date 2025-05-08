import React, { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import html2canvas from "html2canvas";
import RepoTreeVertical from "./RepoTreeVertical";




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
  console.log("Repository data from dependency: ", repo);
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
      {}

      <RepoTreeVertical data={dependencies} loading={loading} />
    </div>
  );
};

export default DependencyGraphSection;
