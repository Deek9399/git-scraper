import React from "react";
import RepoTreeVertical from "./RepoTreeVertical";

const SupportSection = ({ repo, dependencies, loading }) => {
  return (
    <div
      style={{
        padding: "20px",
        maxHeight: "90vh",
        overflow: "auto",
        fontFamily: "sans-serif",
      }}>
      {/* <h2>Dependency Tree: {dependencies.name}</h2>
      <TreeNode node={dependencies} /> */}
      {/* <RepoTree /> */}
      {/* <RepoTreeProject /> */}
      <RepoTreeVertical />
    </div>
  );
};

export default SupportSection;
