import mongoose, { Schema, models } from "mongoose";


const userInfoSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String, default: '/avatr-image.png' },
}, { _id: false });

const expenseSchema = new Schema({
  paidBy: userInfoSchema, 
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  splitBetween: [userInfoSchema], 
  date: { type: Date, default: Date.now },
});

const sharedWalletSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  createdBy: userInfoSchema,
  members: [userInfoSchema], 
  expenses: [expenseSchema],
}, { 
  timestamps: true 
});

export const SharedWallet = models.SharedWallet || mongoose.model("SharedWallet", sharedWalletSchema);
