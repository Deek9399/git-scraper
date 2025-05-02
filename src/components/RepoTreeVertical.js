import React, {
  useState,
  useRef,
  useLayoutEffect,
  forwardRef,
  createRef,
} from "react";

import html2canvas from "html2canvas";

// Component for rendering each node box
const NodeBox = forwardRef(({ node, onClick }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    style={{
      border: "1px solid #ffffff88",
      padding: "10px",
      borderRadius: "8px",
      background: "#222222",
      color: "#ffffff",
      boxShadow: "2px 2px 8px rgba(255,255,255,0.1)",
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
      <div style={{ fontSize: "0.75em", marginTop: "4px", color: "#F4D35E" }}>
        ▶ Click to {node._expanded ? "collapse" : "expand"}
      </div>
    )}
  </div>
));

// Recursive tree node renderer
const TreeNode = ({ node, level = 0, isLast = true }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          position: "relative",
        }}>
        {/* ├ or └ elbow */}
        {level > 0 && (
          <div
            style={{
              width: 50,
              height: "100%",
              position: "relative",
            }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: expanded && node.children.length > 0 ? 0 : "50%",
                left: "50%",
                borderLeft: "2px solid #F4D35E",
              }}
            />
            {/* Horizontal elbow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                width: "120px",
                borderBottom: "2px solid #F4D35E",
                left: "10%",
              }}
            />
          </div>
        )}

        {/* NodeBox */}

        <NodeBox
          node={{ ...node, _expanded: expanded }}
          onClick={() => {
            if (node.children.length > 0) setExpanded(!expanded);
          }}
        />
      </div>

      {/* Children */}
      {expanded && node.children.length > 0 && (
        <div
          style={{
            borderLeft: "2px solid #F4D35E",
            marginLeft: 260, // 👈 increase this
            paddingLeft: 20, // 👈 and this for visible spacing
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
  const treeRef = useRef(null);

  const handleDownload = () => {
    if (!treeRef.current) return;

    html2canvas(treeRef.current, {
      backgroundColor: "#121212", // matches dark theme
      scale: 2, // higher resolution
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
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        overflow: "auto",
        width: "100%",
        height: "100vh",
        whiteSpace: "nowrap",
        backgroundColor: "#121212",
        color: "#ffffff",
      }}>
      {/* Heading + Button */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ color: "#F4D35E", marginBottom: "20px" }}>
          📂 Project Structure View
        </h2>
        <button
          onClick={handleDownload}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            background: "#F4D35E",
            color: "#121212",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}>
          ⬇️ Download as PNG
        </button>
      </div>

      {/* 🌳 Tree rendering area */}
      <div ref={treeRef}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <span style={{ fontSize: "18px", color: "#F4D35E" }}>
              ⏳ Building dependency tree...
            </span>
          </div>
        ) : data ? (
          <TreeNode node={data} />
        ) : (
          <div style={{ color: "#EE964B", textAlign: "center" }}>
            ⚠️ No data to display
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoTreeVertical;
