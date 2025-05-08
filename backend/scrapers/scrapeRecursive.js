const puppeteer = require("puppeteer");


const fetch = require("node-fetch");

async function getMetadata(name) {
  console.log(`[INFO] Fetching metadata for: ${name}`);

  let githubRepo = name;
  if (name.startsWith("@") ) {
    try {
      const npmResponse = await fetch(`https://registry.npmjs.org/${name}`);
      const npmData = await npmResponse.json();

      const repoUrl = npmData.repository?.url || "";
      const match = repoUrl.match(/github\.com[:/](.+?)(\.git)?$/);
      if (match) {
        githubRepo = match[1]; // e.g., babel/code-frame
      } else {
        throw new Error("Could not parse GitHub URL");
      }
    } catch (err) {
      console.warn("Fallback to GitHub metadata failed for npm name:", name);
      return {
        description: "No metadata found",
        license: "Unknown",
        lastModified: "Unknown",
        forks: 0,
      };
    }
  }

  const url = `https://api.github.com/repos/${githubRepo}`;
  console.log(`[INFO] URL:`,url);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "my-github-scraper",
      Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN || ""}`,
    },
  });

  if (!response.ok) {
    console.error(`❌ GitHub metadata fetch failed for ${githubRepo}:`, response.statusText);
    return {
      description: `No metadata found`,
      license: "Unknown",
      lastModified: "Unknown",
      forks: 0,
    };
  }

  const data = await response.json();
  return {
    description: data.description || "No description",
    license: data.license?.spdx_id || "Unknown",
    lastModified: data.updated_at || "Unknown",
    forks: data.forks_count || 0,
  };
}



async function getDependencies(url, depth = 1, maxDepth = 2, visited = new Set()) {
  if (visited.has(url)) {
    console.log(`[🛑] Skipping already visited: ${url}`);
    return { beyondDepthCount: 0 };
  }

  console.log(`🧭 [Depth ${depth}] Visiting: ${url}`);
  visited.add(url);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const deps = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('li.Box-row'));
    return items.map((item) => {
      const nameEl = item.querySelector("a.h4");
      const versionEl = item.querySelector("span.text-mono");
      const href = nameEl?.getAttribute("href");
      return nameEl && versionEl && href
        ? {
            name: nameEl.textContent.trim(),
            version: versionEl.textContent.trim(),
            url: "https://github.com" + href
          }
        : null;
    }).filter(Boolean);
  });

  console.log(`🔍 Found ${deps.length} dependencies at depth ${depth}`);
  await browser.close();

  // ✅ If we've exceeded maxDepth, return only a count
  if (depth > maxDepth) {
    return { beyondDepthCount: deps.length };
  }

  const enrichedDeps = [];

  for (const dep of deps) {
    console.log(`→ Scraping child dependency: ${dep.name}`);
    console.log(`→ Scraping child forks: ${dep.forks}`);
    const meta = await getMetadata(dep.name);

    let children = [];
    let beyondCount = 0;

    const subDeps = await getDependencies(dep.url + "/network/dependencies", depth + 1, maxDepth, visited);

    if (Array.isArray(subDeps)) {
      children = subDeps;
    } else {
      beyondCount = subDeps.beyondDepthCount || 0;
    }

    enrichedDeps.push({
      ...dep,
      ...meta,
      children,
      beyondDepthCount: beyondCount
    });
  }

  return enrichedDeps.length ? enrichedDeps : { beyondDepthCount: 0 };
}



async function scrapeFullTree(owner, repoName) {
  const repoFullName = `${owner}/${repoName}`;
  const url = `https://github.com/${repoFullName}/network/dependencies`;
  const children = await getDependencies(url, 1, 2); // max depth = 3
  const mainMeta = await getMetadata(repoFullName);

  const tree = {
    ...mainMeta,
    name: repoName,
    children: Array.isArray(children) ? children : [],
    beyondDepthCount: Array.isArray(children) ? 0 : children.beyondDepthCount || 0
  };

  return tree;
}



module.exports = { scrapeFullTree };
