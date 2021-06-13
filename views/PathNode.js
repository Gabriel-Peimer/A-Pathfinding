class Node {
    constructor(parent, position, walkable) {
        this.parent = parent;
        this.position = position;
        this.gCost = 0;
        this.hCost = 0;
        this.fCost = 0;
        this.isWalkable = walkable;
    }

    equals(other) {
        return (
            this.position[0] == other.position[0] &&
            this.position[1] == other.position[1]
        );
    }
}
