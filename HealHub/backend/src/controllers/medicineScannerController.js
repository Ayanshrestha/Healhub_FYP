import path from "path";
import { extractTextFromImage, cleanOCRText } from "../services/ocrService.js";
import { matchMedicine, matchMedicineWithScore } from "../services/medicineMatcher.js";

export const scanMedicine = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded." });
        }

        // 1. Extract text from buffer
        const rawText = await extractTextFromImage(req.file.buffer);
        const cleanedLines = cleanOCRText(rawText);

        if (cleanedLines.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Medicine not detected"
            });
        }

        // 2. Find matches
        let bestMatch = null;
        let confidenceScore = 0;

        for (const line of cleanedLines) {
            const result = await matchMedicineWithScore(line);
            if (result && result.score > confidenceScore) {
                bestMatch = result.medicine;
                confidenceScore = result.score;
                if (confidenceScore > 0.9) break; // Strong enough match
            }
        }

        if (!bestMatch) {
            return res.status(200).json({
                success: false,
                message: "Low confidence result – Please try again"
            });
        }

        // 3. Return results
        return res.status(200).json({
            success: true,
            data: {
                brandName: bestMatch.product_name,
                genericName: bestMatch.salt_composition,
                strength: extractStrength(bestMatch.product_name),
                uses: formatAsList(bestMatch.medicine_desc),
                sideEffects: formatAsList(bestMatch.side_effects),
                warnings: formatWarnings(bestMatch.drug_interactions),
                manufacturer: bestMatch.product_manufactured,
                price: bestMatch.product_price,
                confidence: Math.round(confidenceScore * 100)
            }
        });

    } catch (error) {
        console.error("Scanner controller error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message || "An error occurred during scanning." 
        });
    }
};

// Helper to format text into list items for bullet points
const formatAsList = (text) => {
    if (!text) return [];
    // Split by common delimiters like dots, semicolons, or "and" if they look like separate points
    return text.split(/[.;]|\band\b/i)
        .map(item => item.trim())
        .filter(item => item.length > 10); // Keep substantial points
};

// Helper to format interaction warnings from raw JSON
const formatWarnings = (warnings) => {
    if (!warnings) return null;
    try {
        // If it's a JSON string like {"drug": [], "brand": [], "effect": []}
        const parsed = JSON.parse(warnings);
        if (parsed.effect && Array.isArray(parsed.effect) && parsed.effect.length > 0) {
            return parsed.effect.join(", ");
        }
        if (parsed.drug && Array.isArray(parsed.drug) && parsed.drug.length > 0) {
            return `Interact with: ${parsed.drug.join(", ")}`;
        }
        return null;
    } catch (e) {
        // If it's not JSON, return as is (but cleaned)
        return warnings.length > 5 ? warnings : null;
    }
};

// Simple helper to extract strength from name like "Panadol 500mg"
const extractStrength = (name) => {
    const match = name.match(/(\d+\s?(mg|ml|mcg|g|IU))/i);
    return match ? match[0] : "Not specified";
};
