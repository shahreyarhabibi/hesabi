// lib/dashboard.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardSummary, getUserById } from "@/lib/db";
import { calculateSummaryMetrics } from "@/utils/recurringBillsUtils";

/**
 * Fetch all dashboard data for the current user
 * @returns {Promise<Object|null>} Dashboard data or null if unauthorized
 */
export async function getDashboardData() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    const user = await getUserById(session.user.id);
    const summary = await getDashboardSummary(session.user.id);

    if (!user) {
      return null;
    }

    const recurringBills = summary?.recurringBills || [];
    const billsSummary = calculateSummaryMetrics(recurringBills);

    return {
      user,
      summary: {
        currentBalance: summary?.currentBalance || 0,
        currentMonth: summary?.currentMonth || {
          income: 0,
          expenses: 0,
          balance: 0,
        },
        totalSavings: summary?.totalSavings || 0,
        recentTransactions: summary?.recentTransactions || [],
        budgetOverview: summary?.budgetOverview || [],
        potsOverview: summary?.potsOverview || [],
        recurringBills: recurringBills,
        billsSummary: billsSummary,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}
