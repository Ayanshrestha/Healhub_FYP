import fs from "fs";
import { createWorker } from "tesseract.js";

/**
 * Extracts text natively from an image using Tesseract.js (Node.js).
 * This bypasses the memory limits of PyTorch/Python on free servers.
 * @param {string} imagePath - Path to the image file.
 * @returns {Promise<string[]>} - Array of extracted text strings.
 */
export const extractTextFromImage = async (imagePath) => {
    try {
        console.log(`Starting native OCR with Tesseract on ${imagePath}...`);
        // We use createWorker to spin up a tiny background thread for OCR
        const worker = await createWorker('eng', 1, {
            logger: m => console.log(`[Tesseract] Status: ${m.status}`)
        });
        
        const { data: { text } } = await worker.recognize(imagePath);
        await worker.terminate();

        // Split paragraph into an array of lines like Python used to return
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
        
        if (lines.length === 0) {
            throw new Error("No readable text found in the image.");
        }
        
        return lines;
    } catch (error) {
        console.error("Native OCR extraction error:", error.message);
        throw new Error("Failed to extract medical text from image. Please ensure the image is clear.");
    }
};

/**
 * Cleans the extracted text. Since Python already returns cleaned lines,
 * this function now acts as a secondary filter or a pass-through.
 * @param {string|string[]} text - Raw OCR text or array of lines.
 * @returns {string[]} - Array of potential medicine name strings.
 */
export const cleanOCRText = (text) => {
    if (Array.isArray(text)) {
        return text.filter(line => line.length > 2);
    }
    
    // Fallback for string input
    const lines = text.split('\n');
    return lines
        .map(line => line.trim())
        .filter(line => line.length > 3);
};
