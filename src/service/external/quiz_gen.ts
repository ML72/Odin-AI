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
    weight: number;
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
                edges: [...currentChain.edges],
                weight: currentChain.weight
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
                    currentChain.weight += nextNode.weight + connectingEdge.weight;
                    
                    dfs(currentChain, depth + 1);
                    
                    currentChain.weight -= nextNode.weight + connectingEdge.weight;
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
            edges: [],
            weight: node.weight
        };
        dfs(initialChain, 1);
        visited.delete(node);
        
        if (chains.length >= num_chains && num_chains > 0) break;
    }

    return chains; //note to self: node weights are much more overindexed than edge weights
}

//steps: 
// one: want to take a graph
// identify the nodes that are less frequently studied
// then select three nodes that are connected in a chain -- some kind of dfs on sets of n nodes

function extract_json(text: string) {
    const match = text.match(/```json([\s\S]*?)```/);
    const match_data = match ? match[1].trim() : "";

    let node_data;
    try {
        node_data = JSON.parse(match_data);
    }
    catch (error) {
        console.error("Failed to parse JSON: ", error);
        return null;
    }
    return node_data;
}

function chain_pipeline(g: Graph) {
    g.build_adjacency_matrix();
        
    // Get a chain using our updated chain_synthesis function
    const chains = chain_synthesis(g, 3, 100);
    chains.sort((a, b) => a.weight - b.weight);

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

    return { chain_list, chains };
} 

async function gen_question(chain_list: any, chain: any) {

    const random_difficulty = Math.floor(Math.random() * 4) + 1;

    const messages = [
        {
            "role": "user", 
            "content": `Generate a quiz question about the following ideas with the information that connects them at a difficulty level of ${random_difficulty} on a scale from 1 to 4, where 4 is the hardest.
            Return this in the format

            \`\`\`json
            {
                "question": question,
                "answer": answer, 
            }
            \`\`\`
            
            `
        },
        {
            "role": "user", 
            "content": chain_list
        }
    ];

    const question_gen = await prompt_gpt(messages);

    const json_q = extract_json(question_gen);

    json_q['difficulty'] = random_difficulty;
    json_q['chain'] = chain;


    return json_q;
}


/*
    //structure of question:
    {
        "question": question,
        "answer": answer, 
        "difficulty": 1-4 Number,
        "chain": nodes + edges that make up question
    }
*/
function update_graph_weights(next_q: any, g: Graph, difficulty: number) {
    for (const edge of next_q.edges) {
        g.edges[edge.id].weight *= 1/(difficulty/2 + 1)
    }
}


// const g2_nodes = [
//     new N("Great Britain", "", 1),
//     new N("American Revolution", "", 3),
//     new N("Taxation with no representation", "", 0.5),
//     new N("Declaration of Independence", "", 2),
//     new N("Sugar Act", "", 1),
// ]

// const g2_edges = [
//     new Edge("They lost in this battle", 3, g2_nodes[0], g2_nodes[1], 0),
//     new Edge("Root cause of conflict", 0.5, g2_nodes[2], g2_nodes[1], 1),
//     new Edge("Explicitly addressed in document", 3, g2_nodes[1], g2_nodes[3], 2),
//     new Edge("This led to grievances from colonists", 1.5, g2_nodes[2], g2_nodes[4], 3)
// ]

// //const g1 = new Graph(g1_nodes, g1_edges);
// const g1 = new Graph(g2_nodes, g2_edges);
// const g2 = await constructSharedGraph(g1, new Graph([], []));

// g2.print();


//implementation:


//running code when button press:
// const result = chain_pipeline(g2);

// if (result) {
//     const { chain_list, chains } = result;
//     for (let i = 0; i < 1; i++) {
//         const next_q = await gen_question(chain_list[i], chains[i]);
//         console.log(chains[i]);

//         //if you get a question right
//         update_graph_weights(chains[i], g2, next_q['difficulty']);

//         //if you get a question wrong
//         //possibly do nothing because I'm being lazy
//     }
// }

// g2.print();