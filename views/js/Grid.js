class Grid {
    constructor() {
        this.sizeX = 30;
        this.sizeY = 14;
        this.grid = [];

        this.clearGrid();
    }

    getNode(position) {
        return this.grid[position[1]][position[0]];
    }

    getNeighbours(node) {
        let neighbours = [];

        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                if (x == 0 && y == 0) {
                    continue;
                }

                const checkX = node.position[0] + x;
                const checkY = node.position[1] + y;

                // Make sure it's in bounds
                if (
                    checkX >= 0 &&
                    checkX < this.sizeX &&
                    checkY >= 0 &&
                    checkY < this.sizeY
                ) {
                    neighbours.push(this.getNode([checkX, checkY]));
                }
            }
        }
        return neighbours;
    }

    clearGrid() {
        this.grid = [];
        for (let y = 0; y < this.sizeY; y++) {
            let yArray = [];
            for (let x = 0; x < this.sizeX; x++) {
                const node = new Node(null, [x, y], true);
                yArray.push(node);
            }
            this.grid.push(yArray);
        }
    }

    getDistance(nodeA, nodeB) {
        const distanceX = Math.abs(nodeA.position[0] - nodeB.position[0]);
        const distanceY = Math.abs(nodeA.position[1] - nodeB.position[1]);

        if (distanceX > distanceY) {
            return 14 * distanceY + 10 * (distanceX - distanceY);
        }
        return 14 * distanceX + 10 * (distanceY - distanceX);
    }
}
