//currently in progress: need to do node weights before quiz gen


// import OpenAI from "openai";
// import dotenv from "dotenv";
// import { Graph, Edge, N } from './graph.ts';
// import constructSharedGraph from './combine_graphs.ts';

// dotenv.config();

// async function prompt_gpt(message) {

//     const openai = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY
//     });


//     const concept_list = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         store: true,
//         messages: message,
//     });

//     console.log(concept_list.choices[0].message.content)
//     return concept_list.choices[0].message.content;
// }

// async function sort_nodes

// async function gen_question(g: Graph) {
//     //steps: 
//     // one: want to take a graph
//     // identify the nodes that are less frequently studied
//     // then select three nodes that are connected in a chain -- some kind of dfs on sets of n nodes
//     // when given these three nodes, construct a question on causality: how does this thing affect this thing affect this thing 

//     const messages = [
//         {"role": "user", "content": "hi"},
//         {"role": "user", "content": "hi"}
//     ];

//     prompt_gpt(messages);

// }


// const g1_nodes  = [
//     new N("Taxation without representation", "", 0),
//     new N("Sugar Act", "", 0),
//     new N("Stamp Act", "", 0),
// ]
// const g2_nodes = [
//     new N("Great Britain", "", 0),
//     new N("American Revolution", "", 1),
//     new N("Taxation with no representation", "", 1),
//     new N("Declaration of Independence", "", 0)
// ]
// const g1_edges = [
//     new Edge("Led to grievances from colonists", 0, g1_nodes[0], g1_nodes[1]),
//     new Edge("Led to grievances from colonists", 0, g1_nodes[0], g1_nodes[2]),
// ]
// const g2_edges = [
//     new Edge("They lost in this battle", 0, g2_nodes[0], g2_nodes[1]),
//     new Edge("Root cause of conflict", 0, g2_nodes[2], g2_nodes[1]),
//     new Edge("Explicitly addressed in document", 0, g2_nodes[1], g2_nodes[3]),
// ]

// const g1 = new Graph(g1_nodes, g1_edges);
// const g2 = new Graph(g2_nodes, g2_edges);

// const g3 = await constructSharedGraph(g1, g2);

// gen_question(g3);
