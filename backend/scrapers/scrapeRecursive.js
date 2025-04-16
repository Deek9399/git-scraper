const puppeteer = require("puppeteer");
// const { buildDependencyTree } = require("../utils/dependencyTreeBuilder");

async function getMetadata(name) {
  const licenses = ["MIT", "Apache 2.0", "GPL", "BSD"];
  return {
    description: `Auto metadata for ${name}`,
    license: licenses[Math.floor(Math.random() * licenses.length)],
    lastModified: "2025-01-01",
    forks: Math.floor(Math.random() * 100)
  };
}

async function getDependencies(url, depth = 1, maxDepth = 3, visited = new Set()) {
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

  // ✅ If we're beyond the depth limit, return a flat count — no children
  if (depth > maxDepth) {
    return { beyondDepthCount: deps.length };
  }

  const enrichedDeps = [];
  let totalBeyond = 0;

  for (const dep of deps) {
    console.log(`→ Scraping child dependency: ${dep.name}`);
    const meta = await getMetadata(dep.name);
    const subDeps = await getDependencies(dep.url + "/network/dependencies", depth + 1, maxDepth, visited);

    let children = [];
    let beyondDepthCount = 0;

    if (Array.isArray(subDeps)) {
      children = subDeps;
    } else {
      beyondDepthCount = subDeps.beyondDepthCount || 0;
      totalBeyond += beyondDepthCount;
    }

    enrichedDeps.push({
      ...dep,
      ...meta,
      children,
      beyondDepthCount
    });
  }

  return enrichedDeps.length ? enrichedDeps : { beyondDepthCount: totalBeyond };
}


async function scrapeFullTree(owner, repoName) {
  const url = `https://github.com/${owner}/${repoName}/network/dependencies`;
  const children = await getDependencies(url, 1, 3);
  const mainMeta = await getMetadata("Main Program");

  const tree = {
    ...mainMeta,
    name: "Main Program", // this line fixes the missing name issue
    children: Array.isArray(children) ? children : [],
    beyondDepthCount: Array.isArray(children) ? 0 : children.beyondDepthCount || 0
  };

  return { name: "root", children: [tree] };
}

module.exports = { scrapeFullTree };
