import React from "react";
import GitHubProjects from "./fetch-projects";
import RepoSearch from "./RepoSearch";

function App() {
  return (
    <div>
      <RepoSearch />
      <GitHubProjects />
    </div>
  );
}

export default App;
