import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import PotsSection from "@/components/dashboard/PotsSection";
import TransactionsSection from "@/components/dashboard/TransactionsSection";
import BudgetSection from "@/components/dashboard/BudgetSection";
import RecurringBillsSection from "@/components/dashboard/RecurringBillsSection";

export default async function DashboardPage() {
  // ======================
  // Authentication Check
  // ======================
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // ======================
  // Mock Data
  // ======================
  const transactions = [
    {
      id: 1,
      sender: "Ahmad",
      amount: 1000,
      category: "Salary",
      date: "19 Aug 2025",
    },
    {
      id: 2,
      sender: "Mohammad",
      amount: 500,
      category: "Groceries",
      date: "20 Sep 2024",
    },
    {
      id: 3,
      sender: "ali",
      amount: -240,
      category: "Groceries",
      date: "21 Sep 2024",
    },
    {
      id: 4,
      sender: "ali",
      amount: -240,
      category: "Groceries",
      date: "21 Sep 2024",
    },
    {
      id: 5,
      sender: "ali",
      amount: -240,
      category: "Groceries",
      date: "21 Sep 2024",
    },
  ];

  const potsData = [
    { name: "Savings", amount: "$130", color: "bg-cyan-900" },
    { name: "Concert Ticket", amount: "$130", color: "bg-primary" },
    { name: "Laptop", amount: "$130", color: "bg-orange-800" },
    { name: "Mobile", amount: "$130", color: "bg-fuchsia-900" },
  ];

  const recurringBills = [
    { name: "Paid Bills", amount: "$350.0", color: "bg-amber-700" },
    { name: "Paid Bills", amount: "$350.0", color: "bg-blue-800" },
    { name: "Paid Bills", amount: "$350.0", color: "bg-teal-700" },
  ];

  // ======================
  // Main Render
  // ======================
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex w-full items-center mb-6">
        <h1 className="relative  text-foreground text-4xl font-bold">
          Overview
        </h1>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col md:flex-row w-full gap-5 mt-10">
        <StatCard title="Current Balance" value="$4000.0" variant="default" />
        <StatCard title="Income" value="$231.0" variant="gradient" />
        <StatCard title="Expenses" value="$1400" variant="gradient" />
      </div>

      {/* Main Content Area */}
      <div className="h-full flex w-full gap-5">
        {/* Left Column */}
        <div className="flex w-full flex-col gap-5">
          <PotsSection potsData={potsData} totalSaved="$930" />
          <TransactionsSection transactions={transactions} maxItems={5} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-3/4 mt-5 gap-5">
          <BudgetSection budgetCategories={potsData} />
          <RecurringBillsSection bills={recurringBills} />
        </div>
      </div>
    </DashboardLayout>
  );
}
