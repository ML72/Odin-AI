import OpenAI from "openai";
import dotenv from "dotenv";
import { Graph, Edge, N } from './../graphs/graph';
import { constructSharedGraph } from './../graphs/combine_graphs';

dotenv.config();

async function prompt_gpt(message) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });


    const concept_list = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: message,
    });

    console.log(concept_list.choices[0].message.content)
    return concept_list.choices[0].message.content;
}

function chain_bash(g: Graph, chain_len: number = 0, num_chains: number = 0) {
    let chains = []

    for (const edge1 of g.edges) {
        let node1 = edge1.from;
        let node2 = edge1.to;

        for (const edge2 of g.edges) {
            if (edge2.from == node2) {
                let node3 = edge2.to;

                chains.push([node1, node2, node3]);
            }
        }
    }

    return chains;
}

interface Chain {
    nodes: N[];
    edges: Edge[];
}

function chain_synthesis(g: Graph, chain_len: number = 3, num_chains: number = 0): Chain[] {
    let chains: Chain[] = [];
    let nodeIndex = new Map(g.nodes.map((node, index) => [node, index]));
    let visited = new Set<N>();

    function findEdge(from: N, to: N): Edge | undefined {
        return g.edges.find(edge => 
            edge.from.id === from.id && edge.to.id === to.id
        );
    }

    function dfs(currentChain: Chain, depth: number) {
        if (depth === chain_len) {
            chains.push({
                nodes: [...currentChain.nodes],
                edges: [...currentChain.edges]
            });
            return;
        }

        let lastNode = currentChain.nodes[currentChain.nodes.length - 1];
        let lastIndex = nodeIndex.get(lastNode);

        for (let i = 0; i < g.nodes.length; i++) {
            if (g.adj_matrix[lastIndex][i] !== 0 && !visited.has(g.nodes[i])) {
                const nextNode = g.nodes[i];
                const connectingEdge = findEdge(lastNode, nextNode);
                
                if (connectingEdge) {
                    visited.add(nextNode);
                    currentChain.nodes.push(nextNode);
                    currentChain.edges.push(connectingEdge);
                    
                    dfs(currentChain, depth + 1);
                    
                    currentChain.nodes.pop();
                    currentChain.edges.pop();
                    visited.delete(nextNode);
                    
                    if (chains.length >= num_chains && num_chains > 0) return;
                }
            }
        }
    }

    for (let node of g.nodes) {
        visited.add(node);
        const initialChain: Chain = {
            nodes: [node],
            edges: []
        };
        dfs(initialChain, 1);
        visited.delete(node);
        
        if (chains.length >= num_chains && num_chains > 0) break;
    }

    return chains;
}

async function gen_question(g: Graph) {

    //steps: 
    // one: want to take a graph
    // identify the nodes that are less frequently studied
    // then select three nodes that are connected in a chain -- some kind of dfs on sets of n nodes
    // when given these three nodes, construct a question on causality: how does this thing affect this thing affect this thing 
    g.build_adjacency_matrix();
    
    // Get a chain using our updated chain_synthesis function
    const chains = chain_synthesis(g, 3, 1);
    
    // Verify we got at least one chain
    if (chains.length === 0) {
        console.log("No valid chains found in the graph");
        return;
    }

    let chain_list: string[] = [];
    
    // Process each chain to include both node and edge information
    for (const chain of chains) {
        let chain_str = "";
        
        // Iterate through the nodes and edges to build the connection string
        for (let i = 0; i < chain.nodes.length; i++) {
            const node = chain.nodes[i];
            chain_str += `Node: ${node.title}\nDescription: ${node.body}\n`;
            
            // Add edge information if there is a next node
            if (i < chain.edges.length) {
                const edge = chain.edges[i];
                chain_str += `Connection: ${edge.connection}\nRelationship Strength: ${edge.weight}\n\n`;
            }
        }
        
        chain_list.push(chain_str);
    }

    console.log(chain_list);

    // Prepare messages for GPT prompt
    const messages = [
        {
            "role": "user", 
            "content": "Generate a quiz question about the following ideas with the information that connects them at an easy difficulty level."
        },
        {
            "role": "user", 
            "content": chain_list[0]
        }
    ];

    // Generate the question using GPT
    const question_gen = await prompt_gpt(messages);
    console.log(question_gen);
    
    return {
        chain: chains[0],
        question: question_gen
    };
}

// const g1_nodes  = [
//     new N("Taxation without representation", "", 1),
//     new N("Sugar Act", "", 2),
//     new N("Stamp Act", "", 3),
//     new N("American Revolution", "", 4),
// ]

// const g2_nodes = [
//     new N("Great Britain", "", 1),
//     new N("American Revolution", "", 3),
//     new N("Taxation with no representation", "", 0.5),
//     new N("Declaration of Independence", "", 2),
//     new N("Sugar Act", "", 1),
// ]

// const g1_edges = [
//     new Edge("Led to grievances from colonists", 1, g1_nodes[0], g1_nodes[1]),
//     new Edge("Led to grievances from colonists", 2, g1_nodes[0], g1_nodes[2]),
// ]

// const g2_edges = [
//     new Edge("They lost in this battle", 3, g2_nodes[0], g2_nodes[1]),
//     new Edge("Root cause of conflict", 0.5, g2_nodes[2], g2_nodes[1]),
//     new Edge("Explicitly addressed in document", 3, g2_nodes[1], g2_nodes[3]),
//     new Edge("This led to grievances from colonists", 1.5, g2_nodes[2], g2_nodes[4])
// ]

// const g1 = new Graph(g1_nodes, g1_edges);
// const g2 = new Graph(g2_nodes, g2_edges);

// const g3 = await constructSharedGraph(g1, g2);

// gen_question(g3);
