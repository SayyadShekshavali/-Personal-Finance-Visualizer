import connectToDb from "@/lib/mongodb";
import Transaction from "@/models/addtrans";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectToDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { amount, date, description } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const updated = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, description },
      { new: true }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
