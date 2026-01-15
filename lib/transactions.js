// lib/transactions.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTransactions, getCategories, getUserById } from "@/lib/db";

export async function getTransactionsData() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    const user = await getUserById(session.user.id);
    const transactions = await getTransactions(session.user.id, {});
    const categories = await getCategories(session.user.id);

    if (!user || !transactions) {
      return null;
    }

    // Serialize to plain objects
    const plainTransactions = JSON.parse(JSON.stringify(transactions));
    const plainCategories = JSON.parse(JSON.stringify(categories));

    // Transform transactions to match the expected format
    const formattedTransactions = plainTransactions.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      amount: t.type === "income" ? Math.abs(t.amount) : -Math.abs(t.amount),
      type: t.type === "income" ? "Income" : "Expense",
      category: t.category || "Other", // ✅ FIXED - was t.category_name
      category_icon: t.category_icon || "default",
      category_color: t.category_color || "#6B7280",
      date: t.date,
      recurring: t.recurring,
      recurring_interval: t.recurring_interval,
    }));

    return {
      user: JSON.parse(JSON.stringify(user)),
      transactions: formattedTransactions,
      categories: plainCategories,
    };
  } catch (error) {
    console.error("Error fetching transactions data:", error);
    return null;
  }
}
