// components/budgets/BudgetCard.jsx
"use client";

import { memo, useState } from "react";
import BudgetCardDropdown from "./BudgetCardDropdown";
import BudgetProgressBar from "./BudgetProgressBar";
import BudgetSpendRemaining from "./BudgetSpendRemaining";
import LatestSpendingSection from "./LatestSpendingSection";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { getProgressBarColor } from "@/utils/budgetsUtils";
import { formatCurrency } from "@/lib/constants";

function BudgetCard({
  budget,
  spend,
  transactions,
  currency = "USD",
  openDropdownId,
  onDropdownToggle,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const remaining = budget.max - spend;
  const progressBarColor = getProgressBarColor(budget.color);

  // Get the category name for filtering
  const categoryName = budget.category_name || budget.name;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(budget.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex flex-col md:min-h-150 md:max-h-180 gap-5 shadow-xl bg-brand-gradient border border-text/10 p-5 md:p-10 rounded-2xl">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: budget.color }}
            ></div>
            <h2 className="text-2xl font-semibold">{budget.name}</h2>
          </div>

          <BudgetCardDropdown
            budgetId={budget.id}
            isOpen={openDropdownId === budget.id}
            onToggle={onDropdownToggle}
            onEdit={() => onEdit(budget)}
            onDelete={handleDeleteClick} // ✅ Changed to handleDeleteClick
          />
        </div>

        <p className="text-text">
          Maximum Of {formatCurrency(budget.max, currency)}
        </p>

        <BudgetProgressBar
          spend={spend}
          max={budget.max}
          color={progressBarColor}
        />

        <BudgetSpendRemaining
          spend={spend}
          remaining={remaining}
          budgetColor={budget.color}
          currency={currency}
        />

        <LatestSpendingSection
          budgetName={budget.name}
          categoryName={categoryName}
          transactions={transactions}
          currency={currency}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone and will remove all budget tracking for this category."
        itemName={budget.name}
        isLoading={isDeleting}
      />
    </>
  );
}

export default memo(BudgetCard);
