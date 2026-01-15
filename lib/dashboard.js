// lib/dashboard.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardSummary, getUserById } from "@/lib/db";

export async function getDashboardData() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    // Add await to both async functions!
    const user = await getUserById(session.user.id);
    const summary = await getDashboardSummary(session.user.id);

    // Safety check
    if (!user) {
      return null;
    }

    return {
      user,
      summary: summary || {
        currentBalance: 0,
        currentMonth: {
          income: 0,
          expenses: 0,
          balance: 0,
        },
        totalSavings: 0,
        recentTransactions: [],
        budgetOverview: [],
        potsOverview: [],
        recurringBills: [],
        billsSummary: {
          paid: 0,
          upcoming: 0,
          dueSoon: 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}
