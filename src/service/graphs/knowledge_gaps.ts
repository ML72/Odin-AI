import { Edge, Graph, N } from "./graph";

type AdjacencyList = {
    [key: number]: Edge[];
};

export const knowledgeGaps = async (graph: Graph) => {
    const node_map: N[] = graph.nodes;
    const your_understanding_list: AdjacencyList = {};
    const ground_truth_list: AdjacencyList = {};
    const personal_edges: Edge[] = [];

    for (const edge of graph.edges) {
        if (edge.ground_truth) {
            if (!ground_truth_list[edge.to.id]) {
                ground_truth_list[edge.to.id] = [];
            }
            ground_truth_list[edge.to.id].push(edge);
        }
        else {
            if (!your_understanding_list[edge.to.id]) {
                your_understanding_list[edge.to.id] = [];
            }
            your_understanding_list[edge.to.id].push(edge);
        }
    }

    for (let i = 0; i < node_map.length; i++) {
        if (!ground_truth_list[i]) continue;
        for (const edge of ground_truth_list[i]) {
            let diff = edge.weight;
            if (your_understanding_list[i]){
                for (const my_und of your_understanding_list[i]) {
                    if (((my_und.to == edge.to && my_und.from == edge.from)
                    || (my_und.from == edge.to && my_und.to == edge.from))) {
                        diff = Math.max(0, edge.weight - my_und.weight);
                    }
                }
            }
            edge.weight += diff*1.5;
            personal_edges.push(edge);
        }
    }
    
    return new Graph(node_map, personal_edges);
}
