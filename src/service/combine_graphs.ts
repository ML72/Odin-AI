import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import { Graph, Edge, N } from './graph.ts';

// Load environment variables
dotenv.config();

// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

//Embeddings

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

//test cases
// console.log(await combineKeywords('color', 'colour'));
//Graph combinations


// console.log(await combineKeywords('Taxation with no representation', 'Taxation without representation'));
// console.log(g1_nodes[0].title + " " + g2_nodes[2].title);
// console.log(await combineKeywords(g1_nodes[0].title, g2_nodes[2].title))

//taking in two of your own lecture notes and overlaying them 
async function constructSharedGraph(g1: Graph, g2: Graph) {
    const nodeMap = new Map();
    const mergedEdges = new Set(g1.edges); 

    for (const node of g1.nodes) {
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
        mergedEdges.add(new Edge(edge.connection, edge.weight, newSource, newTarget, g2.id));
    }

    return new Graph(g1.nodes, Array.from(mergedEdges) as Edge[]);
}

//identifying nodes that 
// async function identifyImprovements(notes: Graph, lecture: Graph) {


// }

//More test cases

const g1_nodes  = [
    new N("Taxation without representation", "", 0),
    new N("Sugar Act", "", 0),
    new N("Stamp Act", "", 0),
]

const g2_nodes = [
    new N("Great Britain", "", 0),
    new N("American Revolution", "", 1),
    new N("Taxation with no representation", "", 1),
    new N("Declaration of Independence", "", 0)
]

const g1_edges = [
    new Edge("Led to grievances from colonists", 0, g1_nodes[0], g1_nodes[1]),
    new Edge("Led to grievances from colonists", 0, g1_nodes[0], g1_nodes[2]),
]

const g2_edges = [
    new Edge("They lost in this battle", 0, g2_nodes[0], g2_nodes[1]),
    new Edge("Root cause of conflict", 0, g2_nodes[2], g2_nodes[1]),
    new Edge("Explicitly addressed in document", 0, g2_nodes[1], g2_nodes[3]),
]

const g1 = new Graph(g1_nodes, g1_edges);
const g2 = new Graph(g2_nodes, g2_edges);

// const g3 = await constructSharedGraph(g1, g2);
// g3.print();

export default constructSharedGraph;