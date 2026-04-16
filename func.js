import { Vertex, Edge } from './classes.js'
var startElement = document.getElementById('test1'), endElement = document.getElementById('test2');

let vertices = []
const vertexDisplay = document.getElementById("nodeScreen")

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createVertex = (charac, reached, id, distance) => {
    let vertex = new Vertex(reached, charac, id, distance)
    vertices.push(vertex)
}
const addEdge = (parent_id, to_id, weight) => {
    let edge = new Edge(to_id, weight)
    let vertexInd = -1

    vertices.map((node, ind) => {
        if (node.id == parent_id) vertexInd = ind;
    })

    if (vertexInd >= 0) vertices[vertexInd].edges.push(edge);
    else console.error(`${parent_id} vertex id does not exist.`);
}
const displayInList = () => {
    vertices.map((vertex) => {
        let edges = ""
        vertex.edges.map((edge) => {
            edges = edges + "->" + vertices[edge.connected_to].character
        })
        console.log(`${vertex.character}${edges}`)
    })
}
const displayInDisplay = () => {
    let stackX = 0
    let stackY = 0
    let padding = 70

    vertices.map((vertex, ind) =>{
        let displayNode = document.createElement("div")
        displayNode.className = "node-style"
        displayNode.id = `vertexId${vertex.id}`
        displayNode.innerHTML = vertex.character
        displayNode.style.top = padding + stackY + "px";
        displayNode.style.left = padding + stackX + "px";
        vertexDisplay.append(displayNode)

        stackX += getRandomInt(80, 210)
        if (ind % 2 == 0) stackY = 240 + getRandomInt(-20, 20);
        else stackY = 0 + getRandomInt(-20, 20);
    })
}
const displayLines = () => {
    vertices.map((vertex) => {
        let lineStart = document.getElementById(`vertexId${vertex.id}`)
        vertex.edges.map((edge) => {
            let lineTo = document.getElementById(`vertexId${edge.connected_to}`)
            new LeaderLine(
                lineStart, 
                lineTo,
                {
                    color: '#3d3d3d', 
                    size: 3, 
                    middleLabel: LeaderLine.captionLabel(`${edge.weight}`, {
                        fontSize: '30px',
                        color: 'green'
                    }),
                    path: "straight" 
                }
            );
        })
    })
}

// Vertices initialization
createVertex("S", true, 0, 0)
createVertex("E", false, 5, 0)
createVertex("A", false, 1, 0)
createVertex("D", false, 4, 0)
createVertex("B", false, 2, 0)
createVertex("C", false, 3, 0)

// Adding edges
// S
addEdge(0, 1, 10)
addEdge(0, 5, 8)
// A
addEdge(1, 3, 2)
// B
addEdge(2, 1, 1)
// C
addEdge(3, 2, -2)
// D
addEdge(4, 1, -4)
addEdge(4, 3, -1)
// E
addEdge(5, 4, 1)

console.log(vertices)
displayInList()
displayInDisplay()
displayLines()

