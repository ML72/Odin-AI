import { Graph, Edge, N } from './graph';

//can use openai tokenization
function tokenize(text: string) {
    return text.toLowerCase().match(/\b\w+\b/g) || []; // Tokenizes the text into words
}

function getNGrams(words: string[], n: number) {
    if (words.length < n) return [];
    return words.map((_, i) => words.slice(i, i + n).join(' ')).slice(0, words.length - n + 1);
}

export function bleuScore(text: string, title: string): number {
    const textWords = tokenize(text);
    const titleWords = tokenize(title);

    if (titleWords.length === 0 || textWords.length === 0) return 0;

    let precisions: number[] = [];

    for (let n = 1; n <= Math.min(3, titleWords.length); n++) { // Use up to trigrams
        const textNGrams = new Set(getNGrams(textWords, n));
        const titleNGrams = getNGrams(titleWords, n);
        const matches = titleNGrams.filter(ngram => textNGrams.has(ngram)).length;

        const precision = matches / (titleNGrams.length || 1); // Avoid division by zero
        precisions.push(precision);
    }

    // Compute geometric mean of precisions
    const geometricMean = Math.exp(precisions.reduce((sum, p) => sum + Math.log(p || 1e-10), 0) / precisions.length);

    // Brevity Penalty (prevents short matches from being overvalued)
    const brevityPenalty = titleWords.length > textWords.length 
        ? Math.exp(1 - titleWords.length / textWords.length) 
        : 1;

    // Compute BLEU-based occurrences using a sliding window
    let occurrenceWeight = 0;
    for (let i = 0; i <= textWords.length - titleWords.length; i++) {
        const window = textWords.slice(i, i + titleWords.length);
        let matchScore = 0;

        for (let n = 1; n <= Math.min(3, titleWords.length); n++) {
            const windowNGrams = new Set(getNGrams(window, n));
            const titleNGrams = getNGrams(titleWords, n);
            const matches = titleNGrams.filter(ngram => windowNGrams.has(ngram)).length;
            matchScore += matches / (titleNGrams.length || 1);
        }

        occurrenceWeight += matchScore / 3; // Normalize match score
    }

    return brevityPenalty * geometricMean * (1 + Math.log1p(occurrenceWeight));
}


// const markdown_file1 = `
// # The American Revolution (1775-1783)

// ## Introduction
// The American Revolution was a political and military struggle between the thirteen American colonies and Great Britain. It resulted in the establishment of the United States of America as an independent nation. The conflict was fueled by grievances over taxation, lack of representation, and British control over colonial affairs.
// `

// console.log(bleuScore(markdown_file1, 'American Revolution'));
// console.log(bleuScore(markdown_file1, 'struggle'));
// console.log(bleuScore(markdown_file1, 'Thomas Jefferson'));

