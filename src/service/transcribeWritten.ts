import React, { useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { createWorker } from 'tesseract.js';

// Local state
let imageFiles: string[] = [];

// Use pre-built worker from pdf.js
//GlobalWorkerOptions.workerSrc = path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');

//console.log(GlobalWorkerOptions.workerSrc);

/*
async function load_file(file: string) {
    // Parse the PDF file
    const data = new Uint8Array(fs.readFileSync(file));
    const pdf = await getDocument({ data }).promise;
    console.log(`PDF loaded with ${pdf.numPages} pages`);

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        console.log(page)
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d') as any;
        console.log(context);
        console.log(canvas);
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        const imageURL = canvas.toDataURL('image/png');
        imageFiles.push(imageURL);
        console.log(`Saved page ${i} as PNG`);
        console.log(imageURL);
    }
}*/

/*
async function load_file(file: string) {
    const pdf2img = await import("pdf-img-convert");
    console.log("PDF loaded");
    // Both HTTP, HTTPS, and local paths are supported
    const pdfArray = await pdf2img.convert(file);
    
    function saveImages(pdfArray) {
        pdfArray.forEach((image, index) => {
            const outputPath = path.join('./outputImages', `saveImages_${index}.png`);
            fs.writeFile(outputPath, image, (error) => {
                if (error) {
                    console.error(`Error saving image ${index + 1}:`, error);
                } else {
                    console.log(`Image ${index + 1} saved successfully`);
                }
            });
        });
    }
    // Call the function to save images
    saveImages(pdfArray);
}*/

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

export const handwrittenToText = async (imageFiles: string[]) => {
    let extractedText: string[] = [];
    const worker = await createWorker('eng');
    for (let i = 0; i < imageFiles.length; i++) {
        const ret = await worker.recognize(imageFiles[i]);
        extractedText.push(ret.data.text);
        console.log(ret.data.text);
        await worker.terminate();
    }
    return extractedText;
}

// Load the PDF file
imageFiles = await loadImages('src/data/soviet-union');
console.log(imageFiles);
console.log(handwrittenToText(imageFiles));
