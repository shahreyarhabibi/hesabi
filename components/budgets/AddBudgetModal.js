"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { themeColors, categories } from "@/data/transactionsData";

export default function AddBudgetModal({
  isOpen,
  onClose,
  onAddBudget,
  onUpdateBudget,
  editingBudget,
  existingBudgets = [],
}) {
  const [formData, setFormData] = useState({
    category: "",
    maxSpend: "",
    theme: "teal-600",
  });

  // Get colors that aren't already used
  const getAvailableColors = () => {
    const usedColors = existingBudgets.map((budget) => budget.color);
    return themeColors.filter(
      (color) =>
        !usedColors.includes(color.bgClass) ||
        (editingBudget && editingBudget.color === color.bgClass)
    );
  };

  const availableColors = getAvailableColors();

  // Reset form when modal opens
  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.name || "",
        maxSpend: editingBudget.max?.toString() || "",
        theme: editingBudget.color?.replace("bg-", "") || "teal-600",
      });
    } else {
      setFormData({
        category: "",
        maxSpend: "",
        theme: availableColors[0]?.value || "teal-600",
      });
    }
  }, [editingBudget, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.maxSpend) {
      alert("Please fill in all required fields");
      return;
    }

    const budgetData = {
      id: editingBudget ? editingBudget.id : Date.now(),
      name: formData.category,
      max: parseFloat(formData.maxSpend),
      color: `bg-${formData.theme}`,
      spend: editingBudget?.spend || 0,
    };

    editingBudget ? onUpdateBudget(budgetData) : onAddBudget(budgetData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
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
                {editingBudget ? "Edit Budget" : "Add New Budget"}
              </h2>
              <p className="text-text/70 text-sm mt-1">
                Choose a category to set a spending budget.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Budget Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-text/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
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
              </div>

              {/* Maximum Spend Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Maximum Spend <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-text/50">
                    $
                  </span>
                  <input
                    type="number"
                    name="maxSpend"
                    value={formData.maxSpend}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-text/20 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Theme Color
                </label>
                <div className="relative">
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-text/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                  >
                    {availableColors.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.name}
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

                {/* Color Preview */}
                <div className="mt-3 flex items-center gap-3 p-3 rounded-lg border border-text/10 bg-background/50">
                  <div
                    className={`w-8 h-8 rounded-full bg-${formData.theme}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {themeColors.find((c) => c.value === formData.theme)
                        ?.name || "Color"}
                    </p>
                    <p className="text-xs text-text/70">Preview</p>
                  </div>
                </div>

                {availableColors.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-2">
                    All colors used. Edit existing to change.
                  </p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-6 mt-6 border-t border-text/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border border-text/20 hover:border-text/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg bg-foreground hover:bg-foreground/90 dark:hover:bg-primary/20 dark:hover:text-foreground transition-all hover:cursor-pointer text-background font-semibold shadow-lg hover:shadow-xl active:scale-95 duration-200"
                disabled={availableColors.length === 0 && !editingBudget}
              >
                {editingBudget ? "Update Budget" : "Add Budget"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
