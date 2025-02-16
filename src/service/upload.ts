import { transcribeAudio } from "./external/transcribeAudio";
import { handwrittenToText } from "./external/transcribeWritten";


// The god function which does the WHOLE upload pipeline :)
export const handleUpload = async (selectedUserPngFile: any, selectedMp3File: any, updateProgress: any) => {
    // Step 1: Collect text data from inputs
    let userText: any = null;
    let audioText: any = null;

    if (selectedUserPngFile) {
        userText = await handwrittenToText([selectedUserPngFile]); // Array of single element for now
    }

    if (selectedMp3File) {
        audioText = await transcribeAudio(selectedMp3File);
    }

    // TODO chain more APIs
    


    return ["myname", null, {}];
}
