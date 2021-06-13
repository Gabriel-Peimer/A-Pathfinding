class Board {
    constructor() {
        this.sizeX = 20;
        this.sizeY = 9;
        this.grid = [];

        this.populatGrid();
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

    populatGrid() {
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
}
