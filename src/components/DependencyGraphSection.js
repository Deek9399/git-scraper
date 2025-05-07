import React from "react";
import RepoTreeVertical from "./RepoTreeVertical";

const DependencyGraphSection = ({ repo, dependencies, loading }) => {
  return (
    <div>
      <RepoTreeVertical data={dependencies} loading={loading} />
    </div>
  );
};

export default DependencyGraphSection;
