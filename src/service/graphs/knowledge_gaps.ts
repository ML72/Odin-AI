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
        if (ground_truth_list[i]) {
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
        if (!your_understanding_list[i]) continue;
        for (const edge of your_understanding_list[i]) {
            let exists = false;
            if (ground_truth_list[i]){
                for (const g_t of ground_truth_list[i]) {
                    if ((g_t.to == edge.to && g_t.from == edge.from) ||
                        (g_t.to == edge.from && g_t.from == edge.to)) {
                            exists = true;
                    }
                }
            }
            if (!exists) {
                edge.weight *= .1;
                personal_edges.push(edge);
            }
        }
    }
    
    return new Graph(node_map, personal_edges);
}
/*
const g1_nodes  = [
    new N("Taxation without representation", "", 1, 0),
    new N("Sugar Act", "", 1, 1),
    new N("Stamp Act", "", 2, 2),
]

const g1_edges = [
    new Edge("Led to grievances from colonists1", 2, g1_nodes[0], g1_nodes[1], 1, true, 1),
    new Edge("Led to grievances from colonists", 3, g1_nodes[0], g1_nodes[2], 1, true, 1),
    new Edge("Led to grievances from colonists dne", 3, g1_nodes[1], g1_nodes[2], 1, false, 1)
]

const graph = new Graph(
    g1_nodes, g1_edges
);

const g3 = await knowledgeGaps(graph);
g3.print();
*/
