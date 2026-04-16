// Vertex class
export class Vertex {
    constructor (reached, character, index_id, distance) {
        this.distance = 0
        this.character = character
        this.id = index_id
        this.reached = reached
        this.edges = []
    }
}

// Edge class
export class Edge {
    constructor (what_vertex, weight) {
        this.connected_to = what_vertex;
        this.weight = weight
    }
}
