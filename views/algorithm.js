async function algorithm(grid, start, end) {
    const startNode = new Node(null, start, true);
    startNode.gCost = startNode.hCost = startNode.fCost = 0;

    const endNode = new Node(null, end, true);
    endNode.gCost = endNode.hCost = endNode.fCost = 0;

    // Initialize the open and closed lists
    let openList = [];
    let closedList = [];
    openList.push(startNode);
    let path = null;

    while (openList.length > 0) {
        if (path != null) {
            break;
        }
        await sleep(100);
        [openList, closedList, path] = step(
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

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function step(grid, startNode, endNode, openList, closedList) {
    const currentNode = findLowestFCost(openList);

    // Add to closed list
    openList = openList.filter((node) => {
        return node != currentNode;
    });
    closedList.push(currentNode);

    // If we reached the end
    if (currentNode.equals(endNode)) {
        return [openList, closedList, retracePath(startNode, currentNode)];
    }

    const neighbours = grid.getNeighbours(currentNode);
    for (let i = 0; i < neighbours.length; i++) {
        const neighbourNode = neighbours[i];

        // Make sure it's walkable
        if (
            neighbourNode.isWalkable == false ||
            closedList.includes(neighbourNode)
        ) {
            continue;
        }

        const newMovementCost =
            currentNode.gCost + getDistance(currentNode, neighbourNode);
        if (
            newMovementCost < neighbourNode.gCost ||
            openList.includes(neighbourNode) == false
        ) {
            // create the g, h, f costs
            neighbourNode.gCost = newMovementCost;
            neighbourNode.hCost = getDistance(neighbourNode, endNode);
            neighbourNode.fCost = neighbourNode.gCost + neighbourNode.hCost;

            neighbourNode.parent = currentNode;

            if (openList.includes(neighbourNode) == false) {
                openList.push(neighbourNode);
            }
        }
    }
    return [openList, closedList, null];
}

function findLowestFCost(openList) {
    let currentLowest = openList[0];

    openList.forEach((node) => {
        if (
            node.fCost < currentLowest.fCost ||
            (node.fCost == currentLowest.fCost &&
                node.hCost < currentLowest.hCost)
        ) {
            currentLowest = node;
        }
    });

    return currentLowest;
}

function getDistance(nodeA, nodeB) {
    const distanceX = Math.abs(nodeA.position[0] - nodeB.position[0]);
    const distanceY = Math.abs(nodeA.position[1] - nodeB.position[1]);

    if (distanceX > distanceY) {
        return 14 * distanceY + 10 * (distanceX - distanceY);
    }
    return 14 * distanceX + 10 * (distanceY - distanceX);
}

function retracePath(startNode, endNode) {
    let path = [];
    let currentNode = endNode;

    while (currentNode != startNode) {
        path.push(currentNode);
        currentNode = currentNode.parent;
    }
    return path.reverse();
}
