import React, { useState, useRef, forwardRef } from "react";
import html2canvas from "html2canvas";

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
    <div style={{ fontWeight: "bold", fontSize: "16px" }}>{node.name}</div>
    <div style={{ fontSize: "0.85em" }}>
      <div>
        <strong>License:</strong> {node.license}
      </div>
      <div>
        <strong>Modified:</strong> {node.lastModified}
      </div>
      <div>
        <strong>Forks:</strong> {node.forks}
      </div>
    </div>
    {node.children.length > 0 && (
      <div style={{ fontSize: "0.75em", marginTop: "4px", color: "#008000" }}>
        ▶ Click to {node._expanded ? "collapse" : "expand"}
      </div>
    )}
  </div>
));

// Recursive renderer
const TreeNode = ({ node, level = 0, isLast = true }) => {
  const [expanded, setExpanded] = useState(false);

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
                bottom: expanded && node.children.length > 0 ? 0 : "50%",
                left: "50%",
                borderLeft: "2px solid #8250DF",
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
          onClick={() => {
            if (node.children.length > 0) setExpanded(!expanded);
          }}
        />
      </div>

      {expanded && node.children.length > 0 && (
        <div
          style={{
            borderLeft: "2px solid #000000",
            marginLeft: 260,
            paddingLeft: 20,
          }}>
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              level={level + 1}
              isLast={index === node.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RepoTreeVertical = ({ data, loading }) => {
  console.log("data", data);
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
        {/* <h2 style={{ color: "#0969DA", marginBottom: "20px" }}>
          📂 Project Structure View
        </h2> */}
        <button
          onClick={handleDownload}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            background: "#2DA44E",
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
            <span style={{ fontSize: "18px", color: "#8250DF" }}>
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
