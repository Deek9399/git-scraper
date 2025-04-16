
// dependencyTreeBuilder.js

/**
 * Converts a flat list of dependency edges into a layered tree structure.
 * Shows up to 3 layers; beyond layer 3, adds a "more" count.
 *
 * @param {Array} edges - Array of [parent, child] pairs.
 * @param {string} root - The root node (e.g., "root" or a main package name)
 * @param {number} maxDepth - Maximum depth to render (default = 3)
 * @returns {Object} tree-like nested structure
 */

function buildDependencyTree(edges, root = "root", maxDepth = 3) {
  const graph = {};

  for (const [parent, child] of edges) {
    if (!graph[parent]) graph[parent] = [];
    graph[parent].push(child);
  }

  function buildTree(node, depth) {
    if (depth > maxDepth) return null;

    const children = graph[node] || [];

    if (depth === maxDepth) {
      return children.length > 0
        ? { name: node, more: children.length }
        : { name: node };
    }

    return {
      name: node,
      children: children.map(child => buildTree(child, depth + 1))
    };
  }

  return buildTree(root, 1);
}

module.exports = {
  buildDependencyTree
};