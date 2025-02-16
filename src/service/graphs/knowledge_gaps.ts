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
            ground_truth_list[edge.from.id].push(edge);
            ground_truth_list[edge.to.id].push(edge);
        }
        else {
            your_understanding_list[edge.from.id].push(edge);
            your_understanding_list[edge.to.id].push(edge);
        }
    }

    for (let i = 0; i < node_map.length; i++) {
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