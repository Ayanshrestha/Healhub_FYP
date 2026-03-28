import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        sub_category: {
            type: String,
        },
        product_name: {
            type: String,
            required: true,
            index: true,
        },
        salt_composition: {
            type: String,
        },
        product_price: {
            type: String,
        },
        product_manufactured: {
            type: String,
        },
        medicine_desc: {
            type: String,
        },
        side_effects: {
            type: String,
        },
        drug_interactions: {
            type: String,
        },
    },
    { timestamps: true }
);

// Add a text index for better searching
medicineSchema.index({ product_name: "text", salt_composition: "text" });

export default mongoose.model("Medicine", medicineSchema);
