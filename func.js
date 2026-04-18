import { Vertex, Edge } from './classes.js'

let vertices = []
let edgeLines = []

const vertexDisplay = document.getElementById("nodeScreen")
const vertexResult = document.getElementById("results")

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

    vertexDisplay.innerHTML = ""
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
    for (let i = 0; i < vertices.length; i++) edgeLines.push(0);

    vertices.map((vertex) => {
        let edgeLine = [];
        let lineStart = document.getElementById(`vertexId${vertex.id}`)
        vertex.edges.map((edge) => {
            let lineTo = document.getElementById(`vertexId${edge.connected_to}`)

            let line =  new LeaderLine(
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

            edgeLine.push(line)
        })
        edgeLines[vertex.id]= edgeLine
    })
}
const stringDistances = () => {
    let str = ""
    vertices.map((vertex) => {str = str + `${vertex.character}: ${vertex.distance} | `})
    return str
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
console.log(edgeLines)

// Slowed bellman algorithm
let round = 0 
let i_v = 0
const bellman_ford_process = setInterval(() => {
    // Reset line color to grey again every count
    edgeLines.flat().forEach(line => line.setOptions({ color: '#3d3d3d' }));

    if (round < vertices.length-1) {
        let hasChanged = false
        if (i_v < vertices.length) {
            let vertex = vertices[i_v]

            if (vertex.reached) {
                vertex.edges.map((edge, i_e) => {
                    let edge_vertex = vertices.find(v => v.id === edge.connected_to);
                    let total_weight = vertex.distance + edge.weight

                    if (edgeLines[i_v][i_e])
                        edgeLines[i_v][i_e].setOptions({color: 'red'});
                    vertexResult.innerHTML = stringDistances()

                    if (!edge_vertex.reached || total_weight < edge_vertex.distance) {
                        edge_vertex.distance  = total_weight
                        edge_vertex.reached = true
                        hasChanged = true
                    }
                })
            }

            i_v++
        }


        if (i_v >= vertices.length) {
            i_v = 0

            if (!hasChanged) {
                edgeLines.flat().forEach(line => line.setOptions({ color: '#3d3d3d' }));
                clearInterval(bellman_ford_process)
            }

            round++
        }
    } else {
        clearInterval(bellman_ford_process)
    }
}, 2000)

//Testing shits
/*
let v_h = 0
let e_h = 0
setInterval(() => {
    console.log(`Vertex: ${v_h}, Edge: ${e_h}`)

    if (v_h < edgeLines.length) {
        edgeLines[v_h][e_h].setOptions({
            color: 'red'
        })

        if (e_h < edgeLines[v_h].length-1){ 
            e_h++
        } else if (v_h < edgeLines.length) {
            v_h++;
            e_h = 0;
        }
    }
}, 2000)
*/
