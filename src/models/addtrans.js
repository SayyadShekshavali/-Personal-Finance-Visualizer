import mongoose, { Schema } from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      require: true,
      min: 0,
    },
    date: {
      type: Date,
      require: true,
    },
    description: {
      type: String,
      require: true,
      minlenth: 3,
    },
  },
  {
    timestamps: true,
  }
);
const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

export default Transaction;
