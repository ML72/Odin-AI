import OpenAI from "openai";

import { OPENAI_API_KEY } from "../../../keys";

// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export const transformToMarkdown = async (
    data: string,
) => {
    const startTime = new Date().getTime();
    const developerPrompt = "You are an assistant that converts text to structured/organized markdown. " + 
                          "You respond only with the formatted markdown text and with no explanation";

    const userPrompt = "Your objective is to convert provided text data to markdown format. " +
                         "The markdown should be structured and organized for clarity and should " +
                         "outline the main concepts or sections that the text can be divided into. " +
                         "It is also possible for the text to be ridden with typos and errors. " + 
                         "In the case of errors, you should interpret the text and convert it into something " +
                         "that is readible and error-free. Here is the text data that needs to be converted " +
                         "into markdown: \n" + data;

    const sampleMDPrompt = "The text below contains a sample markdown file that should be " +
                           "used as reference to restructure/transform the text data into markdown. " + 
                           "Here is the data: \n" + 
                           "# The American Revolution (1775-1783)\n"
                           "## Introduction\n" + 
                           "The American Revolution was a political and military struggle between the thirteen " + 
                           "American colonies and Great Britain. It resulted in the establishment of the United States " +
                           "of America as an independent nation. The conflict was fueled by grievances over taxation, " +
                           "lack of representation, and British control over colonial affairs.\n" +
                           "## Causes of the Revolution\n" +
                           "### 1. Taxation Without Representation\n" +
                           "The British government imposed several taxes on the American colonies without granting " +
                           "them representation in Parliament. Notable examples include:\n" +
                           "- **The Sugar Act (1764):** Imposed taxes on sugar and molasses.\n" +
                           "- **The Stamp Act (1765):** Required colonists to pay a tax on printed materials.\n" +
                           "- **The Tea Act (1773):** Allowed the British East India Company to sell tea directly\n" + 
                           "to the colonies, leading to the Boston Tea Party. \n" +
                           "\n" +
                           "### 2. Growing Colonial Resistance\n" +
                           "Colonists formed groups such as the **Sons of Liberty** to protest British policies. " + 
                           "The Boston Massacre (1770) and the Boston Tea Party (1773) were key events that " +
                           "heightened tensions.";

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { 
                role: "developer", 
                content: [
                    {
                        "type": "text",
                        "text": developerPrompt
                    }
                ], 
            },
            {
                role: "user",
                content: [
                    {
                        "type": "text",
                        "text": userPrompt
                    },
                    {
                        "type": "text",
                        "text": sampleMDPrompt
                    }
                ]
            },
        ],
        store: true,
    });
    
    console.log(completion.choices[0].message.content);
    console.log("Markdown Transform took", new Date().getTime() - startTime, "milliseconds");
    return completion.choices[0].message.content;
};
