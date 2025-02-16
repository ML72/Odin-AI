import { transcribeAudio } from "./external/transcribeAudio";
import { handwrittenToText } from "./external/transcribeWritten";
import { transformToMarkdown } from "./external/markdownTransform";
import { graph_gen } from "./external/generate_concepts";
import { Graph } from "./graphs/graph";
import { constructSharedGraph } from "./graphs/combine_graphs";
import { knowledgeGaps } from "./graphs/knowledge_gaps";


// The god function which does the WHOLE upload pipeline :)
export const handleUpload = async (selectedUserPngFile: any, selectedMp3File: any, updateProgress: any) => {
    // Step 1: Collect text data from inputs
    let userText: any = null;
    let audioText: any = null;

    if (selectedUserPngFile) {
        userText = await handwrittenToText([selectedUserPngFile]); // Array of single element for now
    }
    updateProgress(15);

    if (selectedMp3File) {
        audioText = await transcribeAudio(selectedMp3File);
    }
    updateProgress(30);

    // Step 2: Transform to markdown
    let userMarkdown: any = null;
    let audioMarkdown: any = null;

    if (userText) {
        userMarkdown = await transformToMarkdown(userText);
    }
    updateProgress(45);

    if (audioText) {
        audioMarkdown = await transformToMarkdown(audioText);
    }
    updateProgress(60);

    // Step 3: Generate separate graphs
    let userGraph: any = null;
    let audioGraph: any = null;

    if (userMarkdown) {
        userGraph = await graph_gen(userMarkdown);
    }
    else {
        userGraph = new Graph([], []);
    }
    updateProgress(70);

    if (audioMarkdown) {
        audioGraph = await graph_gen(audioMarkdown);
    }
    else {
        audioGraph = new Graph([], []);
    }
    updateProgress(80);

    // Step 4: Combine graphs
    let finalGraph = await constructSharedGraph(userGraph, audioGraph);
    
    updateProgress(90);

    // Step 5: Retrieve knowledge gaps
    finalGraph = await knowledgeGaps(finalGraph);

    console.log("Final graph:");
    console.log(finalGraph);
    updateProgress(95);
    
    // Step 6: Retrieve stats
    let stats: any = {} // TODO later
    const name = "Graph " + new Date().toISOString();

    return [name, finalGraph, stats];
}
