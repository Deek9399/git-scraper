const { buildDependencyTree } = require('../scrapers/utils/dependencyTreeBuilder');

test('builds correct tree structure', () => {
  const edges = [
    ['root', 'A'],
    ['A', 'B'],
    ['B', 'C'],
    ['C', 'D']
  ];

  const tree = buildDependencyTree(edges, 'root', 3);

  expect(tree).toEqual({
    name: 'root',
    children: [
      {
        name: 'A',
        children: [
          {
            name: 'B',
            more: 1
          }
        ]
      }
    ]
  });
});
