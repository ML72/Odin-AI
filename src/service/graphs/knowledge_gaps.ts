import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import { Edge, Graph, N } from "./graph";

// Load environment variables
dotenv.config();

type AdjacencyList = {
    [key: number]: Edge[];
};

export const knowledge_gaps = async (graph: Graph) => {
    const node_map: N[] = graph.nodes;
    const your_understanding_list: AdjacencyList = {};
    const ground_truth_list: AdjacencyList = {};
    const personal_edges: Edge[] = [];

    for (const edge of graph.edges) {
        if (edge.ground_truth) {
            if (!ground_truth_list[edge.from.id]) {
                ground_truth_list[edge.from.id] = [];
            }
            if (!ground_truth_list[edge.to.id]) {
                ground_truth_list[edge.to.id] = [];
            }
            ground_truth_list[edge.from.id].push(edge);
            ground_truth_list[edge.to.id].push(edge);
        }
        else {
            if (!your_understanding_list[edge.from.id]) {
                your_understanding_list[edge.from.id] = [];
            }
            if (!your_understanding_list[edge.to.id]) {
                your_understanding_list[edge.to.id] = [];
            }
            your_understanding_list[edge.from.id].push(edge);
            your_understanding_list[edge.to.id].push(edge);
        }
    }
    console.log(ground_truth_list);
    console.log(your_understanding_list);
    for (let i = 0; i < node_map.length; i++) {
        if (!ground_truth_list[i]) continue;
        for (const edge of ground_truth_list[i]) {
            let diff = edge.weight;
            for (const my_und of your_understanding_list[i]) {
                if (((my_und.to == edge.to && my_und.from == edge.from)
                || (my_und.from == edge.to && my_und.to == edge.from))) {
                    diff = Math.max(0, edge.weight - my_und.weight);
                }
            }
            edge.weight += diff*7;
            personal_edges.push(edge);
        }
    }
    
    return new Graph(node_map, personal_edges);
}

const g1_nodes  = [
    new N("Taxation without representation", "", 0),
    new N("Sugar Act", "", 1),
    new N("Stamp Act", "", 2),
]

const g1_edges = [
    new Edge("Led to grievances from colonists1", 0, g1_nodes[0], g1_nodes[1], 1, true),
    new Edge("Led to grievances from colonists", 0, g1_nodes[0], g1_nodes[2], 1, false),
]

const graph = new Graph(
    g1_nodes, g1_edges
);

const g3 = await knowledge_gaps(graph);
g3.print();