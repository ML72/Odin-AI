import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Export audio transcription function
// Accepts MP3 file and returns transcription
export const transcribeAudio = async (
    file: string,
) => {
    const start_time = new Date().getTime();
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(file),
        model: "whisper-1",
        response_format: "text",
    });

    console.log(transcription);
    console.log("Transcription took", new Date().getTime() - start_time, "milliseconds");
    return transcription;
};
