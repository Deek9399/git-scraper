import React from "react";
import GitHubProjects from "./fetch-projects";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RepoSearch from "./RepoSearch";
import RepoDetails from "./components/RepoDetails";

function App() {
  return (
    // <div>
    //   <RepoSearch />
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<RepoSearch />} />
        <Route path="/details/:id" element={<RepoDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
