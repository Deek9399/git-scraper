const puppeteer = require('puppeteer');

const getDependencies = async (req, res) => {
  const { owner, repoName } = req.params;
  if (!owner || !repoName) {
    return res.status(400).json({ error: "Owner and repoName are required" });
  }

  const BASE_URL = `https://github.com/${owner}/${repoName}/network/dependencies`;

  try {
    const all_dependencies = await scrapeDependencies(BASE_URL);
    const dependencies = removeDuplicates(all_dependencies);
    res.json({ totalCount: dependencies.length, dependencies });
  } catch (error) {
    console.error("Error scraping dependencies:", error);
    res.status(500).json({ error: "Failed to scrape dependencies" });
  }
};

async function scrapeDependencies(BASE_URL) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });

  let allDependencies = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const dependencies = await getDependenciesFromPage(page);
    allDependencies = allDependencies.concat(dependencies);
    hasNextPage = await checkForNextPage(page);
    if (hasNextPage) {
      await goToNextPage(page);
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    }
  }

  await browser.close();
  return allDependencies;
}

async function getDependenciesFromPage(page) {
  return page.evaluate(() => {
    const dependencies = [];
    const listItems = document.querySelectorAll('li[data-view-component="true"].Box-row');
    listItems.forEach((item) => {
      const nameElement = item.querySelector("a.h4.Link--primary.Link");
      const versionElement = item.querySelector("span.ml-2.color-fg-muted.text-mono.text-small");
      if (nameElement && versionElement) {
        const name = nameElement.textContent.trim();
        const version = versionElement.textContent.trim();
        const href = nameElement.getAttribute("href");
        if (href) {
          dependencies.push({ name, version, url: `https://github.com${href}` });
        }
      }
    });
    return dependencies;
  });
}

async function checkForNextPage(page) {
  return page.evaluate(() => {
    const nextPageButton = document.querySelector(".next_page");
    return nextPageButton && !nextPageButton.classList.contains("disabled");
  });
}

async function goToNextPage(page) {
  await page.click(".next_page");
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
}

function removeDuplicates(dependencies) {
  return dependencies.filter((dep, index, self) =>
    index === self.findIndex(d => d.name === dep.name)
  );
}

module.exports = { getDependencies };