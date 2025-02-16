<<<<<<< HEAD
import { v4 as uuidv4 } from 'uuid';
import { addGraph, removeGraph } from '../store/slices/graph';
import { Graph } from './graphs/graph';

// Adds a new graph to history
// Returns ID of the new graph
export const addNewGraph = (
    dispatch: any,
    { name, graph, stats }: { name: string, graph: Graph, stats: any }
) => {

    const id = uuidv4();
    dispatch(addGraph({
        id, name, graph, stats
    }));

    return id;
=======
let idCounter = 0;

export class N {
    title: string;
    body: string
    weight: number;
    id: number;

    constructor(title : string, body: string, weight: number) {
        this.title = title;
        this.body = body;
        this.weight = weight;
        this.id = 0;
    }
}

export class Edge {
    connection: string;
    from: N;
    to: N;
    weight: number;
    graph_id: number;

    constructor(title: string, weight: number, from: N, to: N, graph_id: number = -1) {
        this.connection = title;
        this.weight = weight;
        this.from = from;
        this.to = to;
        this.graph_id = graph_id;
    }
}

export class Graph {
    nodes: N[]
    edges: Edge[];
    id: number;

    constructor(nodes: N[], edgeList: Edge[]) {
        this.nodes = nodes;
        this.edges = edgeList;
        this.id = idCounter;

        if (this.edges.length > 0) {
            if (this.edges[0].graph_id == -1) {
                for (let edge of this.edges) {
                    edge.graph_id = idCounter;
                }  
                idCounter ++;
            }
        }
    }

    print() {
        console.log("Graph ID:", this.id);
        console.log("Nodes:", this.nodes);
        console.log("Edges:");
        for (let edge of this.edges) {
            try {
                console.log(`  Edge from ${edge.from.title} to ${edge.to.title}, Graph ID: ${edge.graph_id}`);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    
>>>>>>> knowledge-gap
}
