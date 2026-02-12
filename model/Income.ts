import mongoose, { Schema, models } from "mongoose";

const incomeSchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
}, { 
  timestamps: true 
});

export const Income = models.Income || mongoose.model("Income", incomeSchema);
