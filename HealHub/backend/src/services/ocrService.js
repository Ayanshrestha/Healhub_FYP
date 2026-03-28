import axios from "axios";
import fs from "fs";
import FormData from "form-data";

/**
 * Extracts text from an image using the Python AI Microservice (EasyOCR).
 * @param {string} imagePath - Path to the image file.
 * @returns {Promise<string[]>} - Array of extracted text strings.
 */
export const extractTextFromImage = async (imagePath) => {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(imagePath));

        const response = await axios.post('http://localhost:8000/scan', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        if (response.data.success) {
            return response.data.data; // Array of strings
        } else {
            // This handles the validation error from Python (e.g. "Not a medicine")
            throw new Error(response.data.message || "Failed to extract text.");
        }
    } catch (error) {
        if (error.response) {
            console.error("Python Service Error:", error.response.data);
            throw new Error(error.response.data.detail || "AI Service Error");
        }
        console.error("OCR extraction error:", error.message);
        throw new Error(error.message || "Failed to connect to AI service. Make sure the Python server is running.");
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
