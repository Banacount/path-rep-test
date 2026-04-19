import { Vertex, Edge } from './classes.js'
const VERTICES_SAVE = "saved_vertices"

let vertices = [];
let edgeLines = [];

// Display
const vertexDisplay = document.getElementById("nodeScreen");
const vertexResult = document.getElementById("results");
// Controls
const wordExplain = document.getElementById("wordSalad");
const playBtn = document.getElementById("playBtn");
const cmdInput = document.getElementById("command");
const cmdBtn = document.getElementById("cmdBtn");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createVertex = (charac, reached, id, distance) => {
    let vertex = new Vertex(reached, charac, id, distance);
    vertices.push(vertex);
}
const addEdge = (parent_id, to_id, weight) => {
    let edge = new Edge(to_id, weight);
    let vertexInd = -1;

    vertices.map((node, ind) => {
        if (node.id == parent_id) vertexInd = ind;
    })

    if (vertexInd >= 0) vertices[vertexInd].edges.push(edge);
    else console.error(`${parent_id} vertex id does not exist.`);
}
const displayInList = () => {
    vertices.map((vertex, i_v) => {
        let edges = "";
        vertex.edges.map((edge) => {
            let vertex = vertices.find(v => v.id === edge.connected_to);
            edges = edges + "->" + vertex.character;
        })
        console.log(`${i_v}. [id: ${vertex.id}] ${vertex.character}${edges}`);
    })
}
const displayInDisplay = () => {
    let stackX = 0;
    let stackY = 0;
    let padding = 140;
    vertexDisplay.innerHTML = "";
    vertices.map((vertex, ind) =>{
        let displayNode = document.createElement("div");
        displayNode.className = "node-style";
        displayNode.id = `vertexId${vertex.id}`;
        displayNode.innerHTML = vertex.character
        displayNode.style.top = (padding * 2) + stackY + "px";
        displayNode.style.left = padding + stackX + "px";
        vertexDisplay.append(displayNode);

        stackX += getRandomInt(80, 210);
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
    vertices.map((vertex) => {str = str + `${vertex.character}: ${(vertex.reached) ? vertex.distance : "∞"} | `})
    return str
}

// Slowed bellman algorithm
let round = 0 
let i_v = 0
let wordExpStr = ""
let processEnd = false

const bellman_ford_process = () => {
    // Reset line color to grey again every count
    if (processEnd) return;
    edgeLines.flat().forEach(line => line.setOptions({ color: '#3d3d3d' }));

    if (round < vertices.length-1) {
        let hasChanged = false
        if (i_v < vertices.length) {
            let vertex = vertices[i_v]

            wordExpStr = wordExpStr + `In node '${vertex.character}'`
            if (vertex.reached) {
                vertex.edges.map((edge, i_e) => {
                    let edge_vertex = vertices.find(v => v.id === edge.connected_to);
                    let total_weight = vertex.distance + edge.weight

                    if (edgeLines[vertex.id][i_e])
                        edgeLines[vertex.id][i_e].setOptions({color: 'red'});

                    // Explain the thing hehe
                    if (i_e == 0) wordExpStr = wordExpStr + ", looking at edges";

                    if (!edge_vertex.reached || total_weight < edge_vertex.distance) {
                        // Explain thing again
                        if (!edge_vertex.reached) wordExpStr = wordExpStr + `, found another node called '${edge_vertex.character}'`;
                        else wordExpStr = wordExpStr + `, efficient distance found for node '${edge_vertex.character}'`;
                        
                        edge_vertex.distance  = total_weight
                        edge_vertex.reached = true
                        hasChanged = true
                    }

                    vertexResult.innerHTML = stringDistances()
                })
            } else {
                i_v++
                wordExpStr = ""
                bellman_ford_process()
                return
            }

            i_v++
            if (wordExpStr != "") wordExpStr = wordExpStr + ".";
            wordExplain.innerHTML = wordExpStr
            console.log(wordExpStr)
            wordExpStr = ""
        }


        if (i_v >= vertices.length) {
            i_v = 0

            if (!hasChanged) {
                edgeLines.flat().forEach(line => line.setOptions({ color: '#3d3d3d' }));
                wordExplain.innerHTML = "Early end because nothing has changed."
                processEnd = true
            }

            round++
        }
    } else {
        wordExplain.innerHTML = "Process ended."
        processEnd = true
    }
}
const reload_node_display = () => {
    vertexDisplay.innerHTML = "";
    edgeLines.map((node) => { node.map((edge) => {edge.remove()}) });
    edgeLines = []

    displayInList();
    displayInDisplay();
    displayLines();
}
const default_init = () => {
    // Vertices initialization
    createVertex("S", true, 0, 0);
    createVertex("E", false, 5, 0);
    createVertex("A", false, 1, 0);
    createVertex("D", false, 4, 0);
    createVertex("B", false, 2, 0);
    createVertex("C", false, 3, 0);

    // Adding edges
    // S
    addEdge(0, 1, 10);
    addEdge(0, 5, 8);
    // A
    addEdge(1, 3, 2);
    // B
    addEdge(2, 1, 1);
    // C
    addEdge(3, 2, -2);
    // D
    addEdge(4, 1, -4);
    addEdge(4, 3, -1);
    // E
    addEdge(5, 4, 1);
}

// Play the algorithm by step
playBtn.addEventListener('click', () => {
    bellman_ford_process();
})

// Handle commands
cmdBtn.addEventListener('click', () => {
    let cmd = cmdInput.value;
    if (cmd != "") {
        cmdInput.value = "";
        let cmd_split = cmd.split(" ")

        // Reload command
        if (cmd_split[0] == "reload") reload_node_display();

        // Output test command
        else if (cmd_split[0] == "output") {
            if (cmd_split.length >= 2) console.log(cmd_split[1]);
            else console.error("Error: output command needs 1 argument.");
        }
        
        // Add vertex to the array
        else if (cmd_split[0] == "addnode") {
            if (cmd_split.length >= 2) {
                createVertex(cmd_split[1], false, vertices.length, 0);
                reload_node_display();
                displayInList();
            }
            else console.error("Error: addnode command needs 1 argument.");
        }

        // Add edge to vertices
        else if (cmd_split[0] == "addedge") {
            if (cmd_split.length >= 3) {
                let parent_id = Number(cmd_split[1]);
                let to_id = Number(cmd_split[2]);
                let weight = Number(cmd_split[3]);

                addEdge(parent_id, to_id, weight);
                reload_node_display();
            }
            else console.error("Error: addnode command needs 2 argument.");
        }

        // Clear all vetices and add a root node
        else if (cmd_split[0] == "clear") {
            vertices = [];
            createVertex("R", true, 0, 0);
            reload_node_display();
        }

        // Default command to like default so yeah
        else if (cmd_split[0] == "default") {
            vertices = [];
            default_init();
            reload_node_display();
            localStorage.setItem(VERTICES_SAVE, JSON.stringify(vertices));
        }

        // Output all the vertices formatted hehe
        else if (cmd_split[0] == "vertices") displayInList();

        // Save command to save created vertices
        else if (cmd_split[0] == "save") {
            localStorage.setItem(VERTICES_SAVE, JSON.stringify(vertices));
            console.log("Saved the current list of vertices.")
        }

        // Error when command is not valid
        else console.error(`Error: ${cmd_split[0]} is not a command.`);

    } else {
        console.error("Error: Blank command.");
    }
})


// Check if 
let vertices_save = localStorage.getItem(VERTICES_SAVE);
if (vertices_save == null) {
    default_init();
    localStorage.setItem(VERTICES_SAVE, JSON.stringify(vertices));
} else {
    vertices = JSON.parse(vertices_save);
}

displayInList()
displayInDisplay()
displayLines()
