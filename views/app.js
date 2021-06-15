// The board
let grid = new Board();

let startNode;
let endNode;

// Figure out if mouse is down

const nodeContainer = document.querySelector('.container');

let mouseDown = false;
nodeContainer.onmousedown = function () {
    mouseDown = true;
};
nodeContainer.onmouseup = function () {
    mouseDown = false;
};

// Display original board in DOM

for (let x = 0; x < grid.sizeX; x++) {
    for (let y = 0; y < grid.sizeY; y++) {
        const node = document.createElement('div');
        node.classList.add('node');
        nodeContainer.appendChild(node);
    }
}

function getGridElementsPosition(index) {
    let offset =
        Number(
            window.getComputedStyle(nodeContainer.children[0]).gridColumnStart
        ) - 1;
    if (isNaN(offset)) {
        offset = 0;
    }
    const colCount = window
        .getComputedStyle(nodeContainer)
        .gridTemplateColumns.split(' ').length;
    const rowPosition = Math.floor((index + offset) / colCount);
    const colPosition = (index + offset) % colCount;
    return [rowPosition, colPosition];
}

function getNodeIndex(elm) {
    let c = elm.parentNode.children;
    for (let i = 0; i < c.length; i++) {
        if (c[i] == elm) {
            return i;
        }
    }
}

// So that the user can change the grid
const start = document.querySelector('.start');
const finish = document.querySelector('.finish');
const wall = document.querySelector('.wall');
const run = document.querySelector('.run');
const clear = document.querySelector('.clear');
const nodes = document.querySelectorAll('.node');
let blockType = BlockType.WALL;

start.addEventListener('click', () => {
    blockType = BlockType.START;
});

finish.addEventListener('click', () => {
    blockType = BlockType.END;
});

wall.addEventListener('click', () => {
    blockType = BlockType.WALL;
});

clear.addEventListener('click', () => {
    clearGrid();
});

function clearGrid() {
    grid.populatGrid();

    nodes.forEach((node) => {
        node.className = 'node';
    });
}

function updateNode(node, e) {
    if (blockType == BlockType.START || blockType == BlockType.END) {
        const current = nodeContainer.querySelector(`.${blockType}`);
        if (current != null) {
            current.classList.remove(blockType);
        }
    }

    const [row, col] = getGridElementsPosition(getNodeIndex(e.target));
    if (blockType == BlockType.WALL) {
        grid.grid[row][col].isWalkable = grid.grid[row][col].isWalkable
            ? false
            : true;
    } else if (blockType == BlockType.START) {
        startNode = [col, row];
    } else if (blockType == BlockType.END) {
        endNode = [col, row];
    }
    if (blockType == BlockType.START || blockType == BlockType.END) {
        node.classList.add(blockType);
    } else if (blockType == BlockType.WALL) {
        for (let i = 0; i < node.classList.length; i++) {
            const className = node.classList[i];
            if (className == blockType) {
                node.className = 'node';
                return;
            }
        }
        node.classList.add(blockType);
    }
}

nodes.forEach((node) => {
    node.addEventListener('mouseover', (e) => {
        if (mouseDown) {
            updateNode(node, e);
        }
    });

    node.addEventListener('mousedown', (e) => {
        updateNode(node, e);
    });
});

const speedMap = {
    x1: 100,
    x2: 50,
    x4: 25,
    x8: 12.5,
};

run.addEventListener('click', async function () {
    // Run the algorithm
    clearUnspecialNodes(grid);
    const option = document.getElementById('algorithm-type');
    const speed = document.getElementById('algorithm-speed');
    let path;
    const delay = speedMap[speed.value];
    if (option.value == 'A*') {
        path = await astar(grid, startNode, endNode, delay);
    } else if (option.value == 'Dijkstra') {
        path = await dijkstra(grid, startNode, endNode, delay);
    }
    for (let i = 0; i < path.length; i++) {
        const nodePos = path[i];

        const node = nodeContainer.querySelector(
            `:nth-child(${
                nodePos.position[0] + 1 + nodePos.position[1] * grid.sizeX
            })`
        );
        node.classList.remove('closed');
        node.classList.add('path');

        await sleep(30);
    }
});

// Display the GUI

function updateGUI(openList, closedList) {
    for (let i = 0; i < closedList.length; i++) {
        const nodePosition = closedList[i].position;

        const pathNode = nodeContainer.querySelector(
            `:nth-child(${nodePosition[0] + 1 + nodePosition[1] * grid.sizeX})`
        );
        pathNode.classList.add('closed');
    }
    for (let i = 0; i < openList.length; i++) {
        const nodePosition = openList[i].position;

        const openNode = nodeContainer.querySelector(
            `:nth-child(${nodePosition[0] + 1 + nodePosition[1] * grid.sizeX})`
        );
        openNode.classList.add('open');
    }
}

function clearUnspecialNodes(grid) {
    const closedNodes = document.querySelectorAll('.closed');
    const openNodes = document.querySelectorAll('.open');
    const pathNodes = document.querySelectorAll('.path');

    closedNodes.forEach((node) => {
        node.classList.remove('closed');
    });
    openNodes.forEach((node) => {
        node.classList.remove('open');
    });
    pathNodes.forEach((node) => {
        node.classList.remove('path');
    });

    for (let y = 0; y < grid.sizeY; y++) {
        for (let x = 0; x < grid.sizeX; x++) {
            grid.grid[y][x].gCost =
                grid.grid[y][x].hCost =
                grid.grid[y][x].fCost =
                    0;
        }
    }
}
