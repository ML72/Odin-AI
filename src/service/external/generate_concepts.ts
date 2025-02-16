import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import { Graph, Edge, N } from '../graphs/graph.ts';
import constructSharedGraph from '../graphs/combine_graphs.ts';

// Load environment variables
dotenv.config();

// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/*
to-do graph wise:

code work:
- manual node gen through stripping markdown for relevant pieces
- verify gpt output: every node must occur in the document
- node "size": tf idf

- openai pipelining: 
    - node additional info
    - unidirectional
    - edge weights
    - parse openai output into an actual graph format

done:

- combine two graphs
- address 'spelling mistakes' - kinda done by gpt alr


end goal of graph:

'title': {
        'id': 0
        'weight': (tf idf)
        'edges': {'node' : 'connection' }
        }

convert to:
node: {title ..}

edges: [node][node] -- item is weight
*/

async function extractBoldTerms(markdown: string) {
    const boldPattern = /\*\*(.*?)\*\*/g;
    let matches = [];
    let match;
    while ((match = boldPattern.exec(markdown)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}


async function generateNodes(markdown_text: string) {
    const node_gen = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            {"role": "user", 
                "content": `Given this markdown text, please extract a list of concepts and named entities that are key to the text, as well as a brief dictionary-like entry defining the entity in the context of the text.
                This should be presented in the form 

                \`\`\`json 
                {
                    entity name: description of the entity in the text  
                }
                \`\`\`

                `
            },
            {"role": "user", "content": markdown_text},
        ]
    });

    console.log(node_gen.choices[0].message.content)
    return node_gen.choices[0].message.content;
}

//named entities mention?
export const generateEdges = async (
    markdown_text: string,
    node_list: string
) => {

    // let node_titles = "";
    // for (const node of node_list) {
    //     node_titles += node.title + ", ";
    // }
    // console.log(node_titles);

    const concept_list = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            {"role": "user", "content": 
                `Generate a knowledge graph for the following markdown file by identifying the edges that connect the given list of nodes. 
                    
                ${node_list}

                Each edge should be a one-sentence description of how the nodes are connected based on the concepts presented in the attached text. Also, assess how significant the conection is in the context of the input text with a numerical value from 0 to 1 denoted by the weight, where 1 is the central idea of the text and 0 is insignificant. 
                
                {"node_title": {
                        "edges": [{"node_dst": title, "edge": brief connection between the nodes from the text, "weight": the relevance of this connection in the text}]
                },...}
                
                `},
            {"role": "user", "content": markdown_text}
        ]
    });

    console.log(concept_list.choices[0].message.content)
    return concept_list.choices[0].message.content;
};

function extractCode(input: string) {
    const match = input.match(/```json([\s\S]*?)```/);
    return match ? match[1].trim() : "";
}

async function graph_gen(markdown_text: string) {
    const node_set = await generateNodes(markdown_text);
    const node_list = extractCode(node_set);

    let node_data;
    try {
        node_data = JSON.parse(node_list);
    }
    catch (error) {
        console.error("Failed to parse JSON: ", error);
        return null;
    }

    //convert node_data -> node_list
    const node_titles = Object.keys(node_data);
    const node_list_str = node_titles.join(", ");
    
    console.log(node_list_str);

    const llm_graph = await generateEdges(markdown_text, node_list_str);
    const json_graph = extractCode(llm_graph);

    let data;
    try {
        data = JSON.parse(json_graph);
    } 
    catch (error) {
        console.error("Failed to parse JSON: ", error);
        return null;
    }
    
    let nodes = new Map();
    let edges = [];
    
    for (const [nodeTitle, nodeData] of Object.entries(data)) {
        const node_body = node_data[nodeTitle];
        let node = new N(nodeTitle, node_body, 0);
        nodes.set(nodeTitle, node);
        
        for (const edgeData of nodeData.edges) {
            let targetTitle = edgeData.node_dst;
            let targetNode = nodes.get(targetTitle) || new N(targetTitle, "", 0);
            nodes.set(targetTitle, targetNode);
            
            let edge = new Edge(edgeData.edge, edgeData.weight, node, targetNode);
            edges.push(edge);
        }
    }
    
    return new Graph([...nodes.values()], edges);
}

const markdown_file1 = `
# The American Revolution (1775-1783)

## Introduction
The American Revolution was a political and military struggle between the thirteen American colonies and Great Britain. It resulted in the establishment of the United States of America as an independent nation. The conflict was fueled by grievances over taxation, lack of representation, and British control over colonial affairs.
`

const markdown_file2 = `
## American Revolution

The American Revolution was a pivotal moment in history, marking the colonies' break from Great Britain. Frustrations over British policies and governance fueled the desire for independence, leading to a prolonged conflict that reshaped the future of North America.
`


const g1 = await graph_gen(markdown_file1);

// if (g1) {
//     g1.print();
// }
// else {
//     console.log("g1 is null");
// }
// /*

const g2 = await graph_gen(markdown_file2);

if (g1 && g2) {
    g1.print();
    g2.print();

    const g3 = await constructSharedGraph(g1, g2);
    g3.print();
    g3.saveToFile('graph_save.json');

    const loadedGraph = Graph.loadFromFile('graph_save.json');
    loadedGraph.print();
}
else {
    console.log("one of the graphs is null")
}
//    */

export default generateEdges;