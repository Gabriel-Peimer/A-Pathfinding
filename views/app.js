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
let blockType = 'wall';

start.addEventListener('click', () => {
    blockType = 'start';
});

finish.addEventListener('click', () => {
    blockType = 'end';
});

wall.addEventListener('click', () => {
    blockType = 'wall';
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
    if (blockType == 'start' || blockType == 'end') {
        const current = nodeContainer.querySelector(`.${blockType}`);
        if (current != null) {
            current.classList.remove(blockType);
        }
    }

    const [row, col] = getGridElementsPosition(getNodeIndex(e.target));
    if (blockType == 'wall') {
        grid.grid[row][col].isWalkable = false;
    } else if (blockType == 'start') {
        startNode = [col, row];
    } else if (blockType == 'end') {
        endNode = [col, row];
    }
    node.classList.add(blockType);
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

run.addEventListener('click', async function () {
    // Run the algorithm
    const path = await algorithm(grid, startNode, endNode);
    for (let i = 0; i < path.length; i++) {
        const nodePos = path[i];

        const node = nodeContainer.querySelector(
            `:nth-child(${
                nodePos.position[0] + 1 + nodePos.position[1] * grid.sizeX
            })`
        );
        node.classList.remove('closed');
        node.classList.add('path');

        await sleep(50);
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
