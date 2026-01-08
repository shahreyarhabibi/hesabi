import { useState, useEffect, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const themeColors = [
  { name: "Teal", value: "teal-600", bgClass: "bg-teal-600" },
  { name: "Orange", value: "orange-500", bgClass: "bg-orange-500" },
  { name: "Purple", value: "purple-600", bgClass: "bg-purple-600" },
  { name: "Sky", value: "sky-400", bgClass: "bg-sky-400" },
  { name: "Green", value: "green-500", bgClass: "bg-green-500" },
  { name: "Pink", value: "pink-500", bgClass: "bg-pink-500" },
  { name: "Indigo", value: "indigo-500", bgClass: "bg-indigo-500" },
  { name: "Amber", value: "amber-500", bgClass: "bg-amber-500" },
  { name: "Red", value: "red-500", bgClass: "bg-red-500" },
  { name: "Blue", value: "blue-500", bgClass: "bg-blue-500" },
  { name: "Emerald", value: "emerald-500", bgClass: "bg-emerald-500" },
  { name: "Rose", value: "rose-500", bgClass: "bg-rose-500" },
  { name: "Violet", value: "violet-500", bgClass: "bg-violet-500" },
  { name: "Fuchsia", value: "fuchsia-500", bgClass: "bg-fuchsia-500" },
  { name: "Cyan", value: "cyan-500", bgClass: "bg-cyan-500" },
  { name: "Lime", value: "lime-500", bgClass: "bg-lime-500" },
];

const categories = [
  "Entertainment",
  "Groceries",
  "Dining",
  "Transportation",
  "Shopping",
  "Bills",
  "Personal Care",
  "Healthcare",
  "Education",
  "Other",
];

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

  // Memoize the available theme colors calculation
  const availableThemeColors = useMemo(() => {
    const usedColors = existingBudgets.map((budget) => budget.color);
    return themeColors.filter(
      (color) =>
        !usedColors.includes(color.bgClass) ||
        (editingBudget && editingBudget.color === color.bgClass)
    );
  }, [existingBudgets, editingBudget]); // Only recalculate when these change

  // Reset form when modal opens/closes or editingBudget changes
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
        theme: availableThemeColors[0]?.value || "teal-600",
      });
    }
  }, [editingBudget, isOpen]); // Remove availableThemeColors from dependencies

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

    if (editingBudget) {
      onUpdateBudget(budgetData);
    } else {
      onAddBudget(budgetData);
    }
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
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
                Choose a category to set a spending budget. These categories can
                help you monitor spending.
              </p>
            </div>
            <button
              onClick={handleClose}
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
                    className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                    required
                  >
                    <option className="bg-background text-foreground" value="">
                      Select a category
                    </option>
                    {categories.map((cat) => (
                      <option
                        key={cat}
                        value={cat}
                        className="bg-background text-foreground"
                      >
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

              {/* Theme Selection Dropdown */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Theme Color
                </label>
                <div className="relative">
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                  >
                    {availableThemeColors.map((color) => (
                      <option
                        key={color.value}
                        value={color.value}
                        className="bg-background text-foreground"
                      >
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

                {/* Visual Color Preview */}
                <div className="mt-3 flex items-center gap-3 p-3 rounded-lg border border-text/10 bg-background/50">
                  <div
                    className={`w-8 h-8 rounded-full bg-${formData.theme}`}
                    style={{
                      backgroundColor: getColorHex(formData.theme),
                    }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {themeColors.find((c) => c.value === formData.theme)
                        ?.name || "Color"}
                    </p>
                    <p className="text-xs text-text/70">
                      Preview of selected theme
                    </p>
                  </div>
                </div>

                {availableThemeColors.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-2">
                    All theme colors are already used. Please edit an existing
                    budget to change its color.
                  </p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-6 mt-6 border-t border-text/10">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-lg border border-text/20 hover:border-text/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg bg-foreground hover:bg-primary/20 hover:text-foreground text-background font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
                disabled={availableThemeColors.length === 0 && !editingBudget}
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

// Helper function to get color hex values for inline styles
function getColorHex(colorClass) {
  const colorMap = {
    "teal-600": "#0d9488",
    "orange-500": "#f97316",
    "purple-600": "#9333ea",
    "sky-400": "#38bdf8",
    "green-500": "#22c55e",
    "pink-500": "#ec4899",
    "indigo-500": "#6366f1",
    "amber-500": "#f59e0b",
    "red-500": "#ef4444",
    "blue-500": "#3b82f6",
    "emerald-500": "#10b981",
    "rose-500": "#f43f5e",
    "violet-500": "#8b5cf6",
    "fuchsia-500": "#d946ef",
    "cyan-500": "#06b6d4",
    "lime-500": "#84cc16",
  };
  return colorMap[colorClass] || "#0d9488";
}
