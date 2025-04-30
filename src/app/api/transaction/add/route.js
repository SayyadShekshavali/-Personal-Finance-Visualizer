import connectToDb from "@/lib/mongodb";
import Transaction from "@/models/addtrans";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDb();
    const { amount, date, description } = await req.json();

    if (!amount || !date || !description) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      amount: Number(amount),
      date,
      description,
    });

    return NextResponse.json(newTransaction, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
