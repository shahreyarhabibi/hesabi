"use client";

import { BiDotsHorizontalRounded } from "react-icons/bi";
import Header from "@/components/header/Header";
import DashboardLayout from "../dashboard/DashboardLayout";
import BudgetChart from "@/components/dashboard/BudgetChart";
import {
  Budgets as initialBudgets,
  allTransactions,
} from "@/data/transactionsData";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Image from "next/image";
import { useState } from "react";
import AddBudgetModal from "@/components/budgets/AddBudgetModal";

export default function BudgetsPage() {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleAddBudget = (newBudget) => {
    setBudgets((prev) => [...prev, newBudget]);
    setIsBudgetModalOpen(false);
    console.log("Adding budget:", newBudget);
  };

  const handleUpdateBudget = (updatedBudget) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
    setIsBudgetModalOpen(false);
    setEditingBudget(null);
    console.log("Updating budget:", updatedBudget);
  };

  const handleDeleteBudget = (budgetId) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      setBudgets((prev) => prev.filter((budget) => budget.id !== budgetId));
      setOpenDropdownId(null);
      alert("Budget deleted successfully!");
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setIsBudgetModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDropdownToggle = (budgetId) => {
    setOpenDropdownId(openDropdownId === budgetId ? null : budgetId);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setOpenDropdownId(null);
  };

  // Get all expense transactions from your mock data
  const expenseTransactions = allTransactions.filter(
    (tx) => tx.type === "Expense"
  );

  // Calculate spend for each budget category
  const calculateCategorySpend = (categoryName) => {
    return expenseTransactions
      .filter((tx) => tx.category === categoryName)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  };

  // Get last 3 transactions for a category
  const getLastThreeTransactions = (categoryName) => {
    return expenseTransactions
      .filter((tx) => tx.category === categoryName)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  };

  return (
    <DashboardLayout>
      <Header
        buttonText={"Add New Budget"}
        pageHeader={"Budgets"}
        pageSubHeader={"Manage your budgets"}
        onAdd={() => {
          setEditingBudget(null);
          setIsBudgetModalOpen(true);
        }}
      />
      <div
        className="flex w-full flex-col md:flex-row md:px-30 gap-10"
        onClick={handleClickOutside}
      >
        {/* Budget Summary */}
        <div className="flex flex-col h-180 items-center md:w-2/5 text-foreground bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 p-6 rounded-2xl">
          <BudgetChart />
          <div className="flex flex-col mt-10 self-start w-full">
            <h2 className="text-2xl font-bold">Spending Summary</h2>
            {budgets.map((budget) => {
              const spend = calculateCategorySpend(budget.name);
              return (
                <div
                  key={budget.id}
                  className="flex mt-5 items-center justify-between pb-3 border-b border-text/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-10 ${budget.color}`}></div>
                    <p>{budget.name}</p>
                  </div>

                  <div className="flex  gap-3">
                    <p className="font-bold ">${spend.toLocaleString()}</p>
                    <span className="text-text">
                      of ${budget.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col w-full md:w-3/5 gap-10">
          {/* Render each budget category section */}
          {budgets.map((budget) => {
            const spend = calculateCategorySpend(budget.name);
            const lastThreeTransactions = getLastThreeTransactions(budget.name);
            const remaining = budget.max - spend;
            const progressPercentage = Math.min(
              (spend / budget.max) * 100,
              100
            );

            // Get color for progress bar (use the budget color, fallback to teal)
            const progressBarColor =
              budget.color === "bg-teal-600"
                ? "rgb(39, 124, 120)"
                : budget.color === "bg-orange-500"
                ? "rgb(249, 115, 22)"
                : budget.color === "bg-purple-600"
                ? "rgb(147, 51, 234)"
                : budget.color === "bg-sky-400"
                ? "rgb(56, 189, 248)"
                : "rgb(39, 124, 120)";

            return (
              <div
                key={budget.id}
                className="flex flex-col md:h-180 gap-5 bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 p-5 md:p-10 rounded-2xl"
              >
                <div className="flex items-center w-full justify-between ">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${budget.color}`}
                    ></div>
                    <h2 className="text-2xl font-semibold">{budget.name}</h2>
                  </div>

                  {/* Three dots with dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownToggle(budget.id);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <BiDotsHorizontalRounded className="text-3xl" />
                    </button>

                    {/* Dropdown menu */}
                    {openDropdownId === budget.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-background border border-text/10 rounded-lg shadow-lg z-10 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBudget(budget);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit Budget
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBudget(budget.id);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete Budget
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-text">Maximum Of ${budget.max.toFixed(2)}</p>
                <div
                  data-testid="progress-bar-container"
                  className="h-10 w-full px-1 bg-background/70 rounded-md flex items-center"
                >
                  <div
                    data-testid="progress-bar"
                    className="h-6 rounded-md"
                    style={{
                      width: `${progressPercentage}%`,
                      backgroundColor: progressBarColor,
                      transition: "width 0.3s ease-in-out",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <div className="flex md:flex-1 flex-1/5 items-center gap-5">
                    <div
                      className={`h-13 rounded-md ${budget.color} w-1`}
                    ></div>
                    <p className="flex flex-col font-semibold">
                      ${spend.toFixed(2)}{" "}
                      <span className="text-text font-normal">Spend</span>
                    </p>
                  </div>
                  <div className="flex md:flex-1 items-center gap-5">
                    <div className="h-13 rounded-md bg-orange-600 w-1"></div>
                    <p className="flex flex-col font-semibold">
                      ${remaining.toFixed(2)}{" "}
                      <span className="text-text font-normal">Remaining</span>
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col h-auto mt-5 md:mt-10 bg-background shadow-xl border border-text/10 p-6 gap-5 rounded-2xl">
                  <SectionHeader
                    title="Latest Spending"
                    textSize={"text-md"}
                    linkHref={`/transactions?category=${encodeURIComponent(
                      budget.name
                    )}`}
                  />

                  {lastThreeTransactions.length > 0 ? (
                    lastThreeTransactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className={`flex justify-between pb-5 ${
                          index < lastThreeTransactions.length - 1
                            ? "border-b border-text/10"
                            : ""
                        }`}
                      >
                        <div className="flex gap-4 items-center">
                          <Image
                            className="rounded-full"
                            src={transaction.avatar}
                            height={30}
                            width={30}
                            alt={`${transaction.name} photo`}
                            unoptimized
                          />
                          <p>{transaction.name}</p>
                        </div>
                        <div>
                          <p className={`font-bold text-right`}>
                            ${Math.abs(transaction.amount)}
                          </p>
                          <p className="text-text text-right">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center my-5 text-text">
                      No spending yet
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AddBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        onAddBudget={handleAddBudget}
        onUpdateBudget={handleUpdateBudget}
        editingBudget={editingBudget}
        existingBudgets={budgets}
      />
    </DashboardLayout>
  );
}
