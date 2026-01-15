// lib/budgets.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getBudgets,
  getTransactions,
  getCategories,
  getUserById,
} from "@/lib/db";

export async function getBudgetsData() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    // Add await to all async database functions
    const user = await getUserById(session.user.id);
    const budgets = await getBudgets(session.user.id);
    const transactions = await getTransactions(session.user.id, {});
    const categories = await getCategories(session.user.id);

    // Serialize to plain objects immediately
    const plainUser = JSON.parse(JSON.stringify(user));
    const plainBudgets = JSON.parse(JSON.stringify(budgets || []));
    const plainTransactions = JSON.parse(JSON.stringify(transactions || []));
    const plainCategories = JSON.parse(JSON.stringify(categories || []));

    // Add safety check - ensure budgets is an array
    if (!Array.isArray(plainBudgets)) {
      console.error(
        "Budgets is not an array:",
        typeof plainBudgets,
        plainBudgets
      );
      // Return empty arrays to prevent errors
      return {
        user: plainUser,
        budgets: [],
        transactions: [],
        categories: [],
      };
    }

    // Transform budgets to match the expected format
    const formattedBudgets = plainBudgets.map((b) => ({
      id: b.id,
      name: b.name,
      max: b.max_amount,
      color: b.color || "#0d9488",
      spent: b.spent || 0,
      category_id: b.category_id,
      category_name: b.category_name,
      period: b.period || "monthly",
    }));

    // Transform transactions
    const formattedTransactions = plainTransactions.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      amount: t.type === "income" ? Math.abs(t.amount) : -Math.abs(t.amount),
      type: t.type === "income" ? "Income" : "Expense",
      category: t.category || "Other", // Fixed from category_name
      category_id: t.category_id,
      category_icon: t.category_icon || "default",
      category_color: t.category_color || "#6B7280",
      date: t.date,
    }));

    return {
      user: plainUser,
      budgets: formattedBudgets,
      transactions: formattedTransactions,
      categories: plainCategories,
    };
  } catch (error) {
    console.error("Error fetching budgets data:", error);
    // Return a safe default structure instead of null
    return {
      user: null,
      budgets: [],
      transactions: [],
      categories: [],
    };
  }
}
