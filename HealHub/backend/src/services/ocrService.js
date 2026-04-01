import fs from "fs";
import { createWorker } from "tesseract.js";

// Pharmaceutical keywords that will only appear on medicine packaging
const MEDICAL_KEYWORDS = [
    'mg', 'ml', 'mcg', 'tablet', 'tablets', 'capsule', 'capsules', 'syrup',
    'injection', 'suspension', 'ointment', 'drops', 'solution', 'cream',
    'composition', 'dosage', 'prescription', 'rx', 'usp', 'ip', 'bp',
    'pharma', 'pharmaceutical', 'laboratories', 'lab', 'healthcare',
    'manufactured', 'expiry', 'mfg', 'batch', 'strip', 'contraindication',
    'analgesic', 'antibiotic', 'antiseptic', 'antipyretic', 'antifungal',
    'store below', 'keep out of', 'schedule', 'drug', 'medicine'
];

const DOSAGE_PATTERN = /\d+\s?(mg|ml|mcg|g|iu|%)/i;

/**
 * Validates that the extracted text is from a medicine image.
 * @param {string[]} lines - Extracted text lines from OCR.
 * @returns {boolean}
 */
const isMedicalContent = (lines) => {
    const combined = lines.join(' ').toLowerCase();
    
    // Check for dosage pattern (e.g., 500mg, 10ml, 250mcg)
    if (DOSAGE_PATTERN.test(combined)) return true;
    
    // Check for at least 2 medical keywords to reduce false positives
    const matchCount = MEDICAL_KEYWORDS.filter(kw => combined.includes(kw)).length;
    return matchCount >= 2;
};

/**
 * Extracts text natively from an image using Tesseract.js (Node.js).
 * This bypasses the memory limits of PyTorch/Python on free servers.
 * @param {string} imagePath - Path to the image file.
 * @returns {Promise<string[]>} - Array of extracted text strings.
 */
export const extractTextFromImage = async (imagePath) => {
    try {
        console.log(`Starting native OCR with Tesseract on ${imagePath}...`);
        const worker = await createWorker('eng', 1, {
            logger: m => console.log(`[Tesseract] Status: ${m.status}`)
        });
        
        const { data: { text } } = await worker.recognize(imagePath);
        await worker.terminate();

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
        
        if (lines.length === 0) {
            throw new Error("No readable text found in the image.");
        }

        // Strict medicine validation gate
        if (!isMedicalContent(lines)) {
            throw new Error("This does not appear to be a medicine image. Please upload a clear photo of a medicine box or label.");
        }
        
        return lines;
    } catch (error) {
        console.error("Native OCR extraction error:", error.message);
        throw new Error(error.message || "Failed to extract medical text from image.");
    }
};

/**
 * Cleans the extracted text and filters for potential medicine name lines.
 * @param {string|string[]} text - Raw OCR text or array of lines.
 * @returns {string[]} - Array of potential medicine name strings.
 */
export const cleanOCRText = (text) => {
    const lines = Array.isArray(text) ? text : text.split('\n').map(l => l.trim());
    return lines.filter(line => line.length > 3);
};

