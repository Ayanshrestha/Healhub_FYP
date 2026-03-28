import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import Medicine from "../models/medicine.js";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/HealHub";

const datasets = [
    {
        path: "src/data/medicine_data.csv",
        mapping: (row) => ({
            product_name: row.product_name,
            salt_composition: row.salt_composition,
            product_price: row.product_price,
            product_manufactured: row.product_manufactured,
            medicine_desc: row.medicine_desc,
            side_effects: row.side_effects,
            drug_interactions: row.drug_interactions,
        })
    },
    {
        path: "src/data/medicine_dataset.csv",
        mapping: (row) => {
            const uses = [row.use0, row.use1, row.use2, row.use3, row.use4].filter(Boolean).join(", ");
            const sideEffects = [];
            for (let i = 0; i <= 41; i++) {
                if (row[`sideEffect${i}`]) sideEffects.push(row[`sideEffect${i}`]);
            }
            return {
                product_name: row.name,
                salt_composition: row['Chemical Class'] || "Generic",
                product_price: "N/A",
                product_manufactured: "Manufacturer N/A",
                medicine_desc: uses || row.name,
                side_effects: sideEffects.join(", ") || null,
                drug_interactions: null, // Not available in this dataset
            };
        }
    }
];

const importMedicineData = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB.");

        const batchSize = 1000;
        const limitPerFile = 10000;

        for (const dataset of datasets) {
            let batch = [];
            let processed = 0;

            if (!fs.existsSync(dataset.path)) {
                console.warn(`File not found: ${dataset.path}, skipping...`);
                continue;
            }

            console.log(`\nImporting from ${dataset.path}...`);

            const stream = fs.createReadStream(dataset.path).pipe(csv());

            for await (const row of stream) {
                if (processed >= limitPerFile) break;

                const mapped = dataset.mapping(row);
                if (mapped.product_name) {
                    batch.push(mapped);
                }

                if (batch.length >= batchSize) {
                    await Medicine.insertMany(batch);
                    processed += batch.length;
                    process.stdout.write(`\rProcessed ${processed} records...`);
                    batch = [];
                }
            }

            if (batch.length > 0) {
                await Medicine.insertMany(batch);
                processed += batch.length;
                console.log(`\rProcessed ${processed} records... DONE.`);
            }
        }

        console.log("\nAll imports completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error importing medicine data:", error);
        process.exit(1);
    }
};

importMedicineData();
