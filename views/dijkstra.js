async function dijkstra(grid, start, end, speed) {
    const startNode = grid.grid[start[1]][start[0]];
    const endNode = grid.grid[end[1]][end[0]];

    let openList = [];
    let closedList = [];
    openList.push(startNode);
    let path = null;

    while (openList.length > 0) {
        if (path != null) {
            break;
        }
        await sleep(speed);
        [openList, closedList, path] = stepDijkstra(
            grid,
            startNode,
            endNode,
            openList,
            closedList
        );

        updateGUI(openList, closedList);
    }
    return path;
}

function stepDijkstra(grid, startNode, endNode, openList, closedList) {
    const currentNode = findLowestGCost(openList);
    // Add to closed list
    openList = openList.filter((node) => {
        return node != currentNode;
    });
    closedList.push(currentNode);

    // If we reached the end
    if (currentNode == endNode) {
        return [openList, closedList, retracePath(startNode, endNode)];
    }

    const neighbours = findNeighbours(grid, currentNode);
    neighbours.forEach((neighbour) => {
        if (
            !closedList.includes(neighbour) &&
            !openList.includes(neighbour) &&
            neighbour.isWalkable
        ) {
            openList.push(neighbour);
            neighbour.parent = currentNode;
        }
    });
    return [openList, closedList, null];
}

function findLowestGCost(openList) {
    let currentLowest = openList[0];

    for (let i = 0; i < openList.length; i++) {
        const node = openList[i];
        if (node.gCost < currentLowest.gCost) {
            currentLowest = node;
        }
    }
    return currentLowest;
}

function findNeighbours(grid, node) {
    let neighbours = [];
    const neighbourPositions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    for (let i = 0; i < neighbourPositions.length; i++) {
        const [x, y] = neighbourPositions[i];

        const checkX = node.position[0] + x;
        const checkY = node.position[1] + y;

        // Make sure it's in bounds
        if (
            checkX >= 0 &&
            checkX < grid.sizeX &&
            checkY >= 0 &&
            checkY < grid.sizeY
        ) {
            neighbours.push(grid.getNode([checkX, checkY]));
        }
    }
    return neighbours;
}
