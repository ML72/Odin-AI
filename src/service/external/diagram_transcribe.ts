import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const diagram_transcribe = async (image: string) => {
    // Upload image or assume it's already uploaded and accessible via URL
    


    // Then pass the image URL to the GPT model
    const concept_list = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            { role: "user", 
              content: 
                `Write a text description of what this image portrays with key concepts and ideas
                `
            },
            { role: "user", 
              content: image
            }
        ]
    });

    console.log(concept_list.choices[0].message.content);
    return concept_list.choices[0].message.content;
};


export default diagram_transcribe;

diagram_transcribe("https://alphahistory.com/americanrevolution/wp-content/uploads/2013/01/washington-cmap.jpg");