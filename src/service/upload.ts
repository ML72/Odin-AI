import { transcribeAudio } from "./external/transcribeAudio";
import { handwrittenToText } from "./external/transcribeWritten";
import { transformToMarkdown } from "./external/markdownTransform";


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

    
    // Step 4: Combine graphs, if applicable

    
    // Step 5: Retrieve stats
    


    return ["myname", null, {}];
}
