import connectToDb from "@/lib/mongodb";
import Transaction from "@/models/addtrans";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDb();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
