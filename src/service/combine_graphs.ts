import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
    const embedding1 = await getEmbedding(k1);
    const embedding2 = await getEmbedding(k2);
    const similarity = await cosineSimilarity(embedding1, embedding2);
    return similarity > 0.9;
}

//test cases
// console.log(await combineKeywords('color', 'colour'));
// console.log(await combineKeywords('Taxation with no representation', 'Taxation without representation'));

const g1_nodes  = [
    {"node_title": "Taxation Without Representation", "id": 0, "weight": 8},
    {"node_title": "Sugar Act", "id": 1, "weight": 5},
    {"node_title": "Stamp Act", "id": 2, "weight": 6},
    {"node_title": "Tea Act", "id": 3, "weight": 7}
]

const g1_adj_matrix = [
    [[], [{"weight": 3, "edge_description": "Led to grievances from colonists"}], [{"weight": 4, "edge_description": "Fueled opposition"}], [{"weight": 5, "edge_description": "Increased tensions"}]],
    [[{"weight": 3, "edge_description": "Aimed at raising revenue"}], [], [{"weight": 2, "edge_description": "Preceded and influenced"}], []],
    [[{"weight": 4, "edge_description": "Imposed direct taxes"}], [{"weight": 2, "edge_description": "Early act before Stamp Act"}], [], [{"weight": 3, "edge_description": "Contributed to the Boston Tea Party"}]],
    [[{"weight": 5, "edge_description": "Colonial resistance escalated"}], [], [{"weight": 3, "edge_description": "Response to economic control"}], []]
]

const g2_nodes = [
    {"node_title": "Great Britain", "id": 0, "weight": 10},
    {"node_title": "American Revolution", "id": 1, "weight": 9},
    {"node_title": "Taxation with No Representation", "id": 2, "weight": 7},
    {"node_title": "Declaration of Independence", "id": 3, "weight": 8}

]

const g2_adj_matrix = [
    [[], [{"weight": 6, "edge_description": "Opposed by the colonies"}], [{"weight": 4, "edge_description": "Colonial complaint"}], []],
    [[{"weight": 6, "edge_description": "Fought against Great Britain"}], [], [{"weight": 5, "edge_description": "A major cause of the war"}], [{"weight": 7, "edge_description": "Resulted in a new nation"}]],
    [[{"weight": 4, "edge_description": "Root cause of conflict"}], [{"weight": 5, "edge_description": "Fueled revolutionary sentiment"}], [], [{"weight": 6, "edge_description": "Explicitly addressed in document"}]],
    [[], [{"weight": 7, "edge_description": "Formalized independence"}], [{"weight": 6, "edge_description": "Declared principles against unfair taxation"}], []]    
]

// async function combineGraphs() {


// }

export default combineKeywords;