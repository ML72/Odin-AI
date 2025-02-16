import OpenAI from "openai";
import { Graph, Edge, N } from '../graphs/graph';
import { bleuScore } from '../graphs/node_weight';

import { OPENAI_API_KEY } from "../../../keys";


// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});


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

    return node_gen.choices[0].message.content;
}

//named entities mention?
export const generateEdges = async (
    markdown_text: string,
    node_list: string
) => {

    const concept_list = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            {"role": "user", "content": 
                `Generate a knowledge graph for the following markdown file by identifying the edges that connect the given list of nodes. Between each node, there should be at most one edge.
                    
                ${node_list}

                Each edge should be a one-sentence description of how the nodes are connected based on the concepts presented in the attached text. Also, assess how significant the conection is in the context of the input text with a numerical value from 0 to 1 denoted by the weight, where 1 is the central idea of the text and 0 is insignificant. 
                
                {"node_title": {
                        "edges": [{"node_dst": title, "edge": brief connection between the nodes from the text, "weight": the relevance of this connection in the text}]
                },...}
                
                `},
            {"role": "user", "content": markdown_text}
        ]
    });

    return concept_list.choices[0].message.content;
};

function extractCode(input: string) {
    const match = input.match(/```json([\s\S]*?)```/);
    return match ? match[1].trim() : "";
}


export async function graph_gen(markdown_text: string) {
    const node_set: any = await generateNodes(markdown_text);
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
    
    const llm_graph: any = await generateEdges(markdown_text, node_list_str);
    const json_graph = extractCode(llm_graph);

    let data: any;
    try {
        data = JSON.parse(json_graph);
    } 
    catch (error) {
        console.error("Failed to parse JSON: ", error);
        return null;
    }
    
    let nodes = new Map();
    let edges = [];
    
    for (const [nodeTitle, nodeData] of Object.entries<any>(data)) {
        let node = new N(nodeTitle, node_data[nodeTitle], 0);
        node.freq = bleuScore(markdown_text, node.title);

        nodes.set(nodeTitle, node);
        
        for (const edgeData of nodeData.edges) {
            let targetTitle = edgeData.node_dst;
            let targetNode = nodes.get(targetTitle) || new N(targetTitle, "", 0);
            nodes.set(targetTitle, targetNode);
            
            let edge = new Edge(edgeData.edge, edgeData.weight, node, targetNode, edges.length);
            edges.push(edge);
        }
    }

    const g: Graph = new Graph([...nodes.values()], edges);
    g.calculateNodeCentrality();
    console.log(g);

    return g;
}
