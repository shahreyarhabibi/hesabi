// app/api/transactions/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTransactions, createTransaction } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const options = {
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit"))
        : undefined,
      type: searchParams.get("type") || undefined,
      search: searchParams.get("search") || undefined,
    };

    // Now async!
    const transactions = await getTransactions(session.user.id, options);

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      categoryId,
      name,
      description,
      amount,
      type,
      date,
      recurring,
      recurringInterval,
    } = body;

    // Validation
    if (!name || !amount || !type || !date) {
      return NextResponse.json(
        { error: "Name, amount, type, and date are required" },
        { status: 400 }
      );
    }

    if (!["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      );
    }

    const id = createTransaction(session.user.id, {
      categoryId,
      name,
      description,
      amount: parseFloat(amount),
      type,
      date,
      recurring,
      recurringInterval,
    });

    return NextResponse.json(
      { message: "Transaction created successfully", id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
