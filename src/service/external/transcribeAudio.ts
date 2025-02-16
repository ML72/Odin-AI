import OpenAI from "openai";

import { OPENAI_API_KEY } from "../../../keys";

// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

// Export audio transcription function
// Accepts MP3 file and returns transcription
export const transcribeAudio = async (
    file: File,
) => {
    const start_time = new Date().getTime();
    const transcription = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
        response_format: "text",
    });

    console.log(transcription);
    console.log("Transcription took", new Date().getTime() - start_time, "milliseconds");
    return transcription;
};
