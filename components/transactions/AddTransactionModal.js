// components/transactions/AddTransactionModal.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { FiX, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  categories = [], // Categories from database
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    type: "expense",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    recurring: false,
    recurringInterval: "",
  });

  const [errors, setErrors] = useState({});

  // Use database categories or fallback to defaults
  const availableCategories = useMemo(() => {
    if (categories.length > 0) {
      return categories;
    }

    // Fallback to DEFAULT_CATEGORIES if no database categories
    const defaultCats = [];
    let id = 1;

    DEFAULT_CATEGORIES.expense.forEach((name) => {
      defaultCats.push({ id: id++, name, type: "expense" });
    });

    DEFAULT_CATEGORIES.income.forEach((name) => {
      defaultCats.push({ id: id++, name, type: "income" });
    });

    DEFAULT_CATEGORIES.both.forEach((name) => {
      defaultCats.push({ id: id++, name, type: "both" });
    });

    return defaultCats;
  }, [categories]);

  // Filter categories based on transaction type
  const filteredCategories = useMemo(() => {
    const type = formData.type === "income" ? "income" : "expense";
    return availableCategories.filter(
      (c) => c.type === type || c.type === "both"
    );
  }, [availableCategories, formData.type]);

  // Reset form when modal opens/closes or editing transaction changes
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        // Find the category ID based on category name
        const category = availableCategories.find(
          (c) => c.name === editingTransaction.category
        );

        // Handle date format
        const date = editingTransaction.date?.includes("/")
          ? convertToDateInput(editingTransaction.date)
          : editingTransaction.date || new Date().toISOString().split("T")[0];

        setFormData({
          name: editingTransaction.name || "",
          description: editingTransaction.description || "",
          amount: Math.abs(editingTransaction.amount).toString(),
          type: editingTransaction.type?.toLowerCase() || "expense",
          categoryId:
            category?.id?.toString() ||
            editingTransaction.categoryId?.toString() ||
            "",
          date: date,
          recurring: editingTransaction.recurring || false,
          recurringInterval:
            editingTransaction.recurring_interval ||
            editingTransaction.recurringInterval ||
            "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          amount: "",
          type: "expense",
          categoryId: "",
          date: new Date().toISOString().split("T")[0],
          recurring: false,
          recurringInterval: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editingTransaction, availableCategories]);

  // Update category when type changes (clear if incompatible)
  useEffect(() => {
    if (formData.categoryId) {
      const currentCategory = availableCategories.find(
        (c) => c.id.toString() === formData.categoryId
      );
      const type = formData.type === "income" ? "income" : "expense";

      if (
        currentCategory &&
        currentCategory.type !== type &&
        currentCategory.type !== "both"
      ) {
        setFormData((prev) => ({ ...prev, categoryId: "" }));
      }
    }
  }, [formData.type, formData.categoryId, availableCategories]);

  // Helper function to convert date string to YYYY-MM-DD format
  const convertToDateInput = (dateStr) => {
    if (dateStr.includes("/")) {
      const [month, day, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return new Date().toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    if (formData.recurring && !formData.recurringInterval) {
      newErrors.recurringInterval = "Please select a recurring interval";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transactionData = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    };

    if (editingTransaction) {
      onUpdateTransaction({
        ...transactionData,
        id: editingTransaction.id,
      });
    } else {
      onAddTransaction(transactionData);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-background rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-text/10">
            <div>
              <h2 className="text-foreground text-xl font-bold">
                {editingTransaction
                  ? "Edit Transaction"
                  : "Add New Transaction"}
              </h2>
              <p className="text-text/70 text-sm mt-1">
                {editingTransaction
                  ? "Update transaction details"
                  : "Enter transaction details"}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
          >
            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Grocery shopping, Salary"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? "border-red-500" : "border-text/20"
                  } bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50`}
                  disabled={isLoading}
                  autoFocus
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Type Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: "expense" }))
                    }
                    disabled={isLoading}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      formData.type === "expense"
                        ? "bg-red-500/10 border-red-500 text-red-600"
                        : "border-text/20 hover:border-text/40"
                    } disabled:opacity-50`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: "income" }))
                    }
                    disabled={isLoading}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      formData.type === "income"
                        ? "bg-green-500/10 border-green-500 text-green-600"
                        : "border-text/20 hover:border-text/40"
                    } disabled:opacity-50`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.categoryId ? "border-red-500" : "border-text/20"
                    } bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none disabled:opacity-50`}
                  >
                    <option className="bg-background text-foreground" value="">
                      Select a category
                    </option>
                    {filteredCategories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        className="bg-background text-foreground"
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-text/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Date and Amount Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-3.5 text-text/50" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.date ? "border-red-500" : "border-text/20"
                      } bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50`}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-text/50">
                      $
                    </span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                        errors.amount ? "border-red-500" : "border-text/20"
                      } bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                  )}
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a note (optional)"
                  rows={2}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent text-foreground placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none disabled:opacity-50"
                />
              </div>

              {/* Recurring Checkbox */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="recurring"
                    checked={formData.recurring}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-5 h-5 rounded border-text/20 text-primary focus:ring-primary/40"
                  />
                  <span className="text-sm font-medium text-foreground">
                    This is a recurring transaction
                  </span>
                </label>
              </div>

              {/* Recurring Interval (shown only if recurring is checked) */}
              <AnimatePresence>
                {formData.recurring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Repeat Every <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="recurringInterval"
                        value={formData.recurringInterval}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.recurringInterval
                            ? "border-red-500"
                            : "border-text/20"
                        } bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none disabled:opacity-50`}
                      >
                        <option
                          className="bg-background text-foreground"
                          value=""
                        >
                          Select interval
                        </option>
                        <option
                          className="bg-background text-foreground"
                          value="daily"
                        >
                          Daily
                        </option>
                        <option
                          className="bg-background text-foreground"
                          value="weekly"
                        >
                          Weekly
                        </option>
                        <option
                          className="bg-background text-foreground"
                          value="monthly"
                        >
                          Monthly
                        </option>
                        <option
                          className="bg-background text-foreground"
                          value="yearly"
                        >
                          Yearly
                        </option>
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-text/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.recurringInterval && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.recurringInterval}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-6 mt-6 border-t border-text/10">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg border border-text/20 hover:border-text/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-foreground hover:bg-primary/20 hover:text-foreground text-background font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {editingTransaction ? "Updating..." : "Adding..."}
                  </>
                ) : editingTransaction ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
