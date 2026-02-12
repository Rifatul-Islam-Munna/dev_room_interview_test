import mongoose, { Schema, models } from "mongoose";

const purchaseSchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  isCyclic: { 
    type: Boolean, 
    default: false 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  balanceBefore: { 
    type: Number, 
    required: true 
  },
  balanceAfter: { 
    type: Number, 
    required: true 
  },
}, { 
  timestamps: true 
});

export const Purchase = models.Purchase || mongoose.model("Purchase", purchaseSchema);
