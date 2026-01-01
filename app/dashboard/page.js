// app/dashboard/page.jsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with logout button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user?.name || session.user?.email}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's an overview of your financial dashboard
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Total Balance
            </h3>
            <p className="text-2xl font-bold text-green-600">$5,432.10</p>
            <p className="text-sm text-gray-500 mt-1">+12.5% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              This Month
            </h3>
            <p className="text-2xl font-bold text-blue-600">+$1,234.56</p>
            <p className="text-sm text-gray-500 mt-1">Income: $3,210.00</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Goals Progress
            </h3>
            <p className="text-2xl font-bold text-purple-600">68%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {[
              {
                name: "Groceries",
                date: "Today",
                amount: "-$45.20",
                type: "expense",
              },
              {
                name: "Freelance Payment",
                date: "Yesterday",
                amount: "+$500.00",
                type: "income",
              },
              {
                name: "Netflix Subscription",
                date: "Jan 15",
                amount: "-$15.99",
                type: "expense",
              },
              {
                name: "Coffee Shop",
                date: "Jan 14",
                amount: "-$6.50",
                type: "expense",
              },
              {
                name: "Salary Deposit",
                date: "Jan 12",
                amount: "+$2,800.00",
                type: "income",
              },
            ].map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <span className="text-green-600 font-bold">↑</span>
                    ) : (
                      <span className="text-red-600 font-bold">↓</span>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">
                      {transaction.name}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Account Information</h3>
              <p className="mt-2 opacity-90">Email: {session.user?.email}</p>
              <p className="mt-1 opacity-90">Member since: January 2024</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Account Status</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
