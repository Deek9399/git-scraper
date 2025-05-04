jest.mock('puppeteer', () => ({
    launch: jest.fn(() => ({
      newPage: jest.fn(() => ({
        goto: jest.fn(),
        evaluate: jest.fn(() => []),
        waitForNavigation: jest.fn(),
      })),
      close: jest.fn()
    }))
  }));
  
  const { scrapeFullTree } = require('../scrapers/scrapeRecursive');
  
  test('scrapeFullTree returns tree with name and children', async () => {
    const result = await scrapeFullTree('facebook', 'react');
  
    expect(result).toHaveProperty('name', 'react');
    expect(result).toHaveProperty('children');
    expect(Array.isArray(result.children)).toBe(true);
  });
  