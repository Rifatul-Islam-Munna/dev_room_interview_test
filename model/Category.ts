import mongoose, { Schema, models } from "mongoose";

const categorySchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["income", "expense"],
    required: true 
  },
}, { 
  timestamps: true 
});

export const Category = models.Category || mongoose.model("Category", categorySchema);
