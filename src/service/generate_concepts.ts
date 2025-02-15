import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Load the OpenAI API key from the environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/*
to-do graph wise:
- manual node gen through stripping markdown for relevant pieces
- change prompting for unidirectional edges
- edge weighting algorithm given document
- combine two graphs
- verify gpt output: every node must occur in the document
- node "size": tf idf
- address 'spelling mistakes' - kinda done by gpt alr

end goal of graph:

'title': {
        'id': 0
        'weight': (tf idf)
        'edges': {'node' : 'connection' }
        }

convert to:
node: {title ..}

edges: [node][node] -- item is weight
*/

export const generate_concepts = async (
    markdown_text: string,
) => {
    const concept_list = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            {"role": "user", "content": 
                `Generate a knowledge graph for the following markdown file. Node should represent key concepts, and edges should be a one-sentence description of how the two nodes are related that does not require additional context. Generate a list of nodes, and then write the nodes in the following format for your response:
                    ['node_title': {
                        'edges': [{'node': title, 'edge': one-sentence connection from the text}]
                    },...]
                `},
            {"role": "user", "content": markdown_text}
        ]
    });

    console.log(concept_list.choices[0].message.content);
    return concept_list.choices[0].message.content;
};

export default generate_concepts;

// const markdown_file = `
// # The American Revolution (1775-1783)

// ## Introduction
// The American Revolution was a political and military struggle between the thirteen American colonies and Great Britain. It resulted in the establishment of the United States of America as an independent nation. The conflict was fueled by grievances over taxation, lack of representation, and British control over colonial affairs.

// ## Causes of the Revolution

// ### 1. Taxation Without Representation
// The British government imposed several taxes on the American colonies without granting them representation in Parliament. Notable examples include:
// - **The Sugar Act (1764):** Imposed taxes on sugar and molasses.
// - **The Stamp Act (1765):** Required colonists to pay a tax on printed materials.
// - **The Tea Act (1773):** Allowed the British East India Company to sell tea directly to the colonies, leading to the Boston Tea Party.

// ### 2. Growing Colonial Resistance
// Colonists formed groups such as the **Sons of Liberty** to protest British policies. The Boston Massacre (1770) and the Boston Tea Party (1773) were key events that heightened tensions.
// `

// generate_concepts(markdown_file);