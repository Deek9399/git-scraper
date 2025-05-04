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
  
  jest.mock('../scrapers/scrapeRecursive', () => ({
    scrapeFullTree: jest.fn(() => Promise.resolve({
      name: 'mocked-repo',
      children: []
    }))
  }));
  
  const { getDependencies } = require('../controllers/dependencyController');
  
  const mockReq = {
    params: { owner: 'testuser', repoName: 'testrepo' }
  };
  
  const mockRes = {
    json: jest.fn(),
    status: jest.fn(() => mockRes)
  };
  
  test('getDependencies returns scraped tree', async () => {
    await getDependencies(mockReq, mockRes);
  
    expect(mockRes.json).toHaveBeenCalledWith({
      name: 'mocked-repo',
      children: []
    });
  });
  