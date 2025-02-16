import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import { Graph, Edge, N } from '../graphs/graph.js';
import constructSharedGraph from '../combine_graphs.js';

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

//named entities mention?
export const generateConcepts = async (
    markdown_text: string,
) => {
    const concept_list = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            {"role": "user", "content": 
                `Generate a knowledge graph for the following markdown file. Node should represent key concepts, and edges should be a one-sentence description of how the first node affects the next. Also, assess how significant the conection is with a numerical value from 0 to 1, the weight. 
                Generate a list of nodes, and then write the nodes in the following format for your response:
                
                {"node_title": {
                        "edges": [{"node_dst": title, "edge": one-sentence connection from the text, "weight": how much this connection matters to the text}]
                },...}
                
                `},
            {"role": "user", "content": markdown_text}
        ]
    });

    console.log(concept_list.choices[0].message.content)
    return concept_list.choices[0].message.content;
};

const llm_output = `
Here's a knowledge graph based on the provided markdown text about the American Revolution:

\`\`\`json
{
    "American Revolution": {
        "edges": [
            {"node_dst": "Thirteen Colonies", "edge": "The American Revolution was a struggle between the thirteen American colonies and Great Britain, marking their fight for independence.", "weight": 0.9},
            {"node_dst": "Great Britain", "edge": "The conflict was primarily against Great Britain, who exerted control over the American colonies.", "weight": 0.85}
        ]
    },
    "Thirteen Colonies": {
        "edges": [
            {"node_dst": "Taxation Without Representation", "edge": "Grievances among the thirteen colonies included taxation without representation, leading to revolutionary sentiments.", "weight": 0.8},
            {"node_dst": "Growing Colonial Resistance", "edge": "The struggle of the thirteen colonies sparked movements like the Sons of Liberty, reflecting their resistance.", "weight": 0.75}
        ]
    },
    "Great Britain": {
        "edges": [
            {"node_dst": "Taxation Without Representation", "edge": "The British government imposed taxes without local representation, fueling discontent among the colonies.", "weight": 0.9}
        ]
    }
}
\`\`\` 

` //to replace with manual llm output if necessary

function extractCode(input: string) {
    const match = input.match(/```json([\s\S]*?)```/);
    return match ? match[1].trim() : "";
}

async function graph_gen(markdown_text: string) {
    const llm_graph = await generateConcepts(markdown_text);
    //const llm_graph = llm_output;
    const json_graph = extractCode(llm_graph);

    let data;
    try {
        data = JSON.parse(json_graph);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return null;
    }
    
    let nodes = new Map();
    let edges = [];
    
    for (const [nodeTitle, nodeData] of Object.entries(data)) {
        let node = new N(nodeTitle, "", 0);
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

## Causes of the Revolution

### 1. Taxation Without Representation
The British government imposed several taxes on the American colonies without granting them representation in Parliament. Notable examples include:
- **The Sugar Act (1764):** Imposed taxes on sugar and molasses.
- **The Stamp Act (1765):** Required colonists to pay a tax on printed materials.
- **The Tea Act (1773):** Allowed the British East India Company to sell tea directly to the colonies, leading to the Boston Tea Party.

### 2. Growing Colonial Resistance
Colonists formed groups such as the **Sons of Liberty** to protest British policies. The Boston Massacre (1770) and the Boston Tea Party (1773) were key events that heightened tensions.
`

const markdown_file2 = `
## American Revolution

The American Revolution was a pivotal moment in history, marking the colonies' break from Great Britain. Frustrations over British policies and governance fueled the desire for independence, leading to a prolonged conflict that reshaped the future of North America.

## Taxation with No Representation

One of the primary grievances of the American colonists was taxation without representation. British authorities imposed financial burdens on the colonies without granting them a voice in Parliament. This issue became a rallying cry for revolution, as colonists demanded a say in their own governance.

## Declaration of Independence

On July 4, 1776, the Declaration of Independence was adopted, formally severing ties with Great Britain. Drafted primarily by Thomas Jefferson, this document outlined the colonies' reasons for seeking independence and set forth principles of liberty and self-governance that continue to inspire democratic movements worldwide.
`

const g1 = await graph_gen(markdown_file1);
const g2 = await graph_gen(markdown_file2);

if (g1 && g2) {
    g1.print();
    g2.print();

    const g3 = await constructSharedGraph(g1, g2);
    g3.print();
}
else {
    console.log("one of the graphs is null")
}

export default generateConcepts;