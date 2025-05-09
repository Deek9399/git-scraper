import React, { useState, useRef, forwardRef } from "react";
import html2canvas from "html2canvas";
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
// Node box
const NodeBox = forwardRef(({ node, onClick }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    style={{
      border: "1px solid #D0D7DE",
      padding: "10px",
      borderRadius: "8px",
      background: "#FFFFFF",
      color: "#24292E",
      boxShadow: "2px 2px 6px rgba(0,0,0,0.05)",
      textAlign: "center",
      minWidth: "180px",
      margin: "20px",
      cursor: node.children.length ? "pointer" : "default",
      marginLeft: "120px",
      marginTop: "-70px",
      marginBottom: "90px",
    }}>
    <div style={{ fontWeight: "bold", fontSize: "16px" }}>
      <a
        href={node.url || undefined}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          color: node.url ? "blue" : "#000000",
          cursor: node.url ? "pointer" : "default",
        }}>
        {node.name}
      </a>
    </div>
    <div style={{ fontSize: "0.85em" }}>
      <div>
        <strong>License:</strong> {node.license}
      </div>
      <div>
        <strong>Modified:</strong> {formatDate(node.lastModified)}
      </div>
      <div>
        <strong>Forks:</strong> {node.forks}
      </div>
    </div>
    {node.children.length > 0 && (
      <div style={{ fontSize: "0.75em", marginTop: "4px", color: "#0B60B0" }}>
        ▶ Click to {node._expanded ? "collapse" : "expand"}
      </div>
    )}
  </div>
));

const TreeNode = ({ node, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [children, setChildren] = useState(node.children || []);

  const isBeyondLimit = level >= 2;

  const handleExpand = async () => {
    if (expanded || isBeyondLimit) return;

    if (!children || children.length === 0) {
      setLoadingChildren(true);
      try {
        const response = await fetch(
          `/api/dependency-child?url=${encodeURIComponent(node.url)}&depth=${
            level + 1
          }`
        );
        const result = await response.json();
        setChildren(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("❌ Failed to fetch child dependencies:", err);
      } finally {
        setLoadingChildren(false);
      }
    }

    setExpanded(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          position: "relative",
        }}>
        {level > 0 && (
          <div style={{ width: 50, height: "100%", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: expanded && children.length > 0 ? 0 : "50%",
                left: "50%",
                borderLeft: "2px solid #000000",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                width: "120px",
                borderBottom: "2px solid #000000",
                left: "10%",
              }}
            />
          </div>
        )}

        <NodeBox
          node={{ ...node, _expanded: expanded }}
          onClick={handleExpand}
        />
      </div>

      {loadingChildren && (
        <div style={{ marginLeft: 280, color: "#8a63d2", fontStyle: "italic" }}>
          ⏳ Loading dependencies...
        </div>
      )}

      {expanded && !isBeyondLimit && node.children.length > 0 && (
        <div
          style={{
            borderLeft: "2px solid #000000",
            marginLeft: 260,
            paddingLeft: 20,
          }}>
          {node.children.map((child, index) => (
            <div key={index} style={{ marginBottom: "80px" }}>
              <TreeNode node={child} level={level + 1} />
            </div>
          ))}
        </div>
      )}

      {isBeyondLimit && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginLeft: "320px", // Push to the right of the node box
            marginTop: "-60px", // Align vertically with the node box
            marginBottom: "60px",
          }}>
          <div
            style={{
              backgroundColor: "#0B60B0",
              color: "#ffffff",
              borderRadius: "999px",
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}>
            +{node.beyondDepthCount}
          </div>
        </div>
      )}
    </div>
  );
};

const RepoTreeVertical = ({ data, loading }) => {
  const treeRef = useRef(null);

  const handleDownload = () => {
    if (!treeRef.current) return;

    html2canvas(treeRef.current, {
      backgroundColor: "#FFFFFF",
      scale: 2,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "project-structure.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        padding: "40px",
        overflow: "auto",
        width: "100%",
        height: "100vh",
        whiteSpace: "nowrap",
        backgroundColor: "#FFFFFF",
        color: "#24292E",
      }}>
      <div
        style={{
          textAlign: "right",
          marginBottom: "40px",
          marginRight: "40px",
        }}>
        <button
          onClick={handleDownload}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            background: "#0B60B0",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}>
          ⬇️ Download as PNG
        </button>
      </div>

      <div ref={treeRef}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <span style={{ fontSize: "18px", color: "#000000" }}>
              ⏳ Building dependency tree...
            </span>
          </div>
        ) : data ? (
          <TreeNode node={data} />
        ) : (
          <div style={{ color: "#D1242F", textAlign: "center" }}>
            ⚠️ No data to display
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoTreeVertical;
