import React, { useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { createWorker } from 'tesseract.js';

// Local state
let imageFiles: string[] = [];

// Utility function for loading all images in a directory
// Not used in actual webapp, only used for testing purposes
async function loadImages(dirPath: string) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                return reject(`Error reading directory: ${err.message}`);
            }
            // Filter out image files based on common extensions
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
            const images = files.filter(file => 
                imageExtensions.includes(path.extname(file).toLowerCase())
            ).map(file => path.join(dirPath, file));
            
            resolve(images);
        });
    });
}

// Export audio transcription function
// Accepts MP3 file and returns transcription
export const handwrittenToText = async (imageFiles: string[]) => {
    let extractedText: string[] = [];
    const start_time = new Date().getTime();
    const worker = await createWorker('eng');
    for (let i = 0; i < imageFiles.length; i++) {
        const ret = await worker.recognize(imageFiles[i]);
        extractedText.push(ret.data.text);
        console.log(ret.data.text);
        await worker.terminate();
    }

    // Reduce the array of text into a single string
    let extraction: string = extractedText.reduce((acc, val) => acc + '\n' + val, '');

    console.log(extraction);
    console.log("Transcription took", new Date().getTime() - start_time, "milliseconds");
    return extraction;
}
