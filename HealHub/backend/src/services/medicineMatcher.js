import Fuse from "fuse.js";
import Medicine from "../models/medicine.js";

/**
 * Matches a detected medicine name against the database using fuzzy search.
 * @param {string} detectedName - Name extracted from image.
 * @returns {Promise<Object|null>} - Matched medicine details or null.
 */
export const matchMedicine = async (detectedName) => {
    try {
        // 1. Precise match first for performance
        let match = await Medicine.findOne({ product_name: new RegExp(detectedName, 'i') });
        if (match) return match;

        // 2. Fuzzy match if no exact match (Fetch a subset to avoid memory bloat)
        // In a real production app with 200k rows, we'd use MongoDB's $text index or Atlas Search.
        // For this local version, we'll fetch recently used or common medicines or use regex logic.

        // Let's try MongoDB's text search first
        match = await Medicine.findOne({ $text: { $search: detectedName } }, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } });

        if (match) return match;

        return null;
    } catch (error) {
        console.error("Medicine matching error:", error);
        return null;
    }
};

/**
 * Matches a detected medicine name against the database and returns a score.
 * @param {string} detectedName 
 * @returns {Promise<{medicine: Object, score: number}|null>}
 */
export const matchMedicineWithScore = async (detectedName) => {
    try {
        // 1. Precise match (Score: 1.0)
        let medicine = await Medicine.findOne({ product_name: new RegExp(`^${detectedName}$`, 'i') });
        if (medicine) return { medicine, score: 0.98 };

        // 2. Partial match (Score: 0.85)
        medicine = await Medicine.findOne({ product_name: new RegExp(detectedName, 'i') });
        if (medicine) return { medicine, score: 0.85 };

        // 3. Text search (Score based on textScore)
        medicine = await Medicine.findOne(
            { $text: { $search: detectedName } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });

        if (medicine) {
            // Normalize score (Cap at 0.8 for text search matches)
            return { medicine, score: 0.75 };
        }

        return null;
    } catch (error) {
        console.error("Match with score error:", error);
        return null;
    }
};

/**
 * Advanced matching using Fuse.js on a subset of data
 * @param {string} query 
 * @param {Array} medicines 
 */
export const fuzzyMatchMedicine = (query, medicines) => {
    const fuse = new Fuse(medicines, {
        keys: ["product_name"],
        threshold: 0.4, // Adjust for sensitivity
    });
    const results = fuse.search(query);
    return results.length > 0 ? results[0].item : null;
};
