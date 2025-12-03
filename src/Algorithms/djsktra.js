// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(grid, startNode, finishNode) {
  // Array to store the order in which nodes are visited.
  const visitedNodesInOrder = [];

  // Set the distance of the start node to 0, as it's the starting point.
  startNode.distance = 0;

  // Get all nodes from the grid and store them in an array.
  const unvisitedNodes = getAllNodes(grid);

  // Continue the loop until there are no more unvisited nodes.
  while (!!unvisitedNodes.length) {
      // Sort the unvisited nodes by their distance (closest first).
      sortNodesByDistance(unvisitedNodes);

      // Get the closest node (node with the smallest distance).
      const closestNode = unvisitedNodes.shift();

      // If the closest node is a wall, skip it (walls are obstacles).
      if (closestNode.isWall) continue;

      // If the closest node has a distance of infinity, it means we're trapped.
      // Return the visited nodes in order up to this point.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;

      // Mark the closest node as visited.
      closestNode.isVisited = true;

      // Add the closest node to the list of visited nodes in order.
      visitedNodesInOrder.push(closestNode);

      // If the closest node is the finish node, we've found the shortest path.
      // Return the visited nodes in order.
      if (closestNode === finishNode) return visitedNodesInOrder;

      // Update the distances of the unvisited neighbors of the closest node.
      updateUnvisitedNeighbors(closestNode, grid);
  }
}

// Sorts the unvisited nodes by their distance in ascending order.
// This ensures that the node with the smallest distance is processed first.
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Updates the distances of the unvisited neighbors of the given node.
// This is a key step in Dijkstra's algorithm, where we relax the edges.
function updateUnvisitedNeighbors(node, grid) {
  // Get all unvisited neighbors of the current node.
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

  // For each unvisited neighbor, update its distance and set its previous node.
  for (const neighbor of unvisitedNeighbors) {
      // The distance to the neighbor is the distance to the current node + 1.
      neighbor.distance = node.distance + 1;

      // Set the previous node of the neighbor to the current node.
      // This allows us to backtrack and find the shortest path later.
      neighbor.previousNode = node;
  }
}

// Returns all unvisited neighbors of the given node.
// Neighbors are nodes that are directly above, below, left, or right of the current node.
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;

  // Check the node above the current node.
  if (row > 0) neighbors.push(grid[row - 1][col]);

  // Check the node below the current node.
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);

  // Check the node to the left of the current node.
  if (col > 0) neighbors.push(grid[row][col - 1]);

  // Check the node to the right of the current node.
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  // Filter out any neighbors that have already been visited.
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Returns all nodes in the grid as a flat array.
// This is used to initialize the list of unvisited nodes.
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
      for (const node of row) {
          nodes.push(node);
      }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// This function should be called after running Dijkstra's algorithm.
// It works by following the `previousNode` property of each node,
// starting from the finish node and going back to the start node.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  // Traverse the path backwards from the finish node to the start node.
  while (currentNode !== null) {
      // Add the current node to the beginning of the array.
      nodesInShortestPathOrder.unshift(currentNode);

      // Move to the previous node in the path.
      currentNode = currentNode.previousNode;
  }

  // Return the array of nodes in the order of the shortest path.
  return nodesInShortestPathOrder;
}