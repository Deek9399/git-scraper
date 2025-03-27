import React from "react";
import GitHubProjects from "./fetch-projects";
import RepoSearch from "./RepoSearch";

function App() {
    return (
        <div className="App">
            <h1>Web Scrapper</h1>
            <RepoSearch />
            <GitHubProjects />
        </div>
    );
}

export default App;


