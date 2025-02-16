import OpenAI from "openai";
import { Graph, Edge, N } from './graph';

import { OPENAI_API_KEY } from "../../../keys";


// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

// Embeddings
async function getEmbedding(keyword: string) {
    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: keyword,
        encoding_format: "float",
      });
      return embedding.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw error;
    }
}
  
async function cosineSimilarity(k1: number[], k2: number[]) {
    const dotProduct = k1.reduce((sum, value, index) => sum + value * k2[index], 0);
    const magnitudeA = Math.sqrt(k1.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(k2.reduce((sum, value) => sum + value * value, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}

async function combineKeywords(k1: string, k2: string) {
    const embedding1 = await getEmbedding(k1.toLowerCase());
    const embedding2 = await getEmbedding(k2.toLowerCase());
    const similarity = await cosineSimilarity(embedding1, embedding2);
    return similarity > 0.9;
}

// Taking in two of your own lecture notes and overlaying them 
export async function constructSharedGraph(g1: Graph, g2: Graph) {
    const nodeMap = new Map();
    const mergedEdges = new Set(g1.edges); 

    let i = 0;

    for (let node of g1.nodes) {
        nodeMap.set(node.title, node);
    }

    for (const node2 of g2.nodes) {
        let matchedNode = null;

        for (const node1 of g1.nodes) {
            if (await combineKeywords(node1.title, node2.title)) {
                matchedNode = node1; 
                break;
            }
        }

        if (matchedNode) {
            nodeMap.set(node2.title, matchedNode);
        } else {
            nodeMap.set(node2.title, node2);
            g1.nodes.push(node2);
        }
    }

    for (const edge of g2.edges) {
        const newSource = nodeMap.get(edge.from.title);
        const newTarget = nodeMap.get(edge.to.title);
        mergedEdges.add(new Edge(edge.connection, edge.weight, newSource, newTarget, g2.id, true, 1));
    }

    for (let i = 0; i < g1.nodes.length; i++) {
        g1.nodes[i].id = i;
    }

    const edgeList = Array.from(mergedEdges) as Edge[];

    for (let i = 0; i < edgeList.length; i++) {
        //find id of source and dest
        for (const node of g1.nodes) {
            if (edgeList[i].from.title == node.title) {
                edgeList[i].from.id = node.id;
            }
            if (edgeList[i].to.title == node.title) {
                edgeList[i].to.id = node.id;
            }
        }
    }


    return new Graph(g1.nodes, edgeList);
}
