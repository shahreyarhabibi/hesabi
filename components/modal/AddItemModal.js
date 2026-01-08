"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { themeColors } from "@/data/transactionsData";

// Default theme colors - can be shared or customized per component

// Helper function to get color hex value
const getColorHex = (colorClass) => {
  const color = themeColors.find((c) => c.value === colorClass);
  return color ? color.hex : "#0d9488";
};

// Configuration for different types
const typeConfigs = {
  budget: {
    title: (editing) => (editing ? "Edit Budget" : "Add New Budget"),
    description:
      "Choose a category to set a spending budget. These categories can help you monitor spending.",
    fields: [
      {
        type: "select",
        name: "category",
        label: "Budget Category",
        required: true,
        options: [
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
        ],
      },
      {
        type: "number",
        name: "maxSpend",
        label: "Maximum Spend",
        required: true,
        prefix: "$",
        placeholder: "0.00",
      },
    ],
    saveButtonText: (editing) => (editing ? "Update Budget" : "Add Budget"),
  },
  pot: {
    title: (editing) => (editing ? "Edit Pot" : "Add New Pot"),
    description:
      "Set up a new savings pot to track your progress towards a goal.",
    fields: [
      {
        type: "text",
        name: "name",
        label: "Pot Name",
        required: true,
        placeholder: "e.g., Laptop, Vacation, Emergency Fund",
      },
      {
        type: "number",
        name: "target",
        label: "Target Amount",
        required: true,
        prefix: "$",
        placeholder: "0.00",
      },
    ],
    saveButtonText: (editing) => (editing ? "Update Pot" : "Add Pot"),
  },
};

export default function AddItemModal({
  isOpen,
  onClose,
  onSave,
  editingItem = null,
  existingItems = [],
  type = "budget", // "budget" or "pot"
  config = {},
}) {
  // Get the current config for the type
  const currentConfig = useMemo(() => {
    const baseConfig = typeConfigs[type] || typeConfigs.budget;

    // Merge with custom config if provided
    return {
      ...baseConfig,
      title: config.title || baseConfig.title,
      description: config.description || baseConfig.description,
      fields: config.fields || baseConfig.fields,
      themeColors: config.themeColors || themeColors,
    };
  }, [type, config]); // Only recalc when type or config changes

  const [formData, setFormData] = useState(() => {
    // Initialize form data based on type
    const initialData = {
      theme: currentConfig.themeColors[0]?.value || "teal-600",
    };

    // Initialize all fields to empty strings
    currentConfig.fields.forEach((field) => {
      initialData[field.name] = "";
    });

    return initialData;
  });

  // Get available theme colors (exclude already used ones)
  const availableThemeColors = useMemo(() => {
    const usedColors = existingItems.map((item) => item.color);
    return currentConfig.themeColors.filter(
      (color) =>
        !usedColors.includes(color.bgClass) ||
        (editingItem && editingItem.color === color.bgClass)
    );
  }, [existingItems, editingItem, currentConfig.themeColors]);

  // Reset form when modal opens/closes or editingItem changes
  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      const data = {
        theme:
          editingItem.color?.replace("bg-", "") ||
          currentConfig.themeColors[0]?.value,
      };

      // Set fields based on type
      if (type === "budget") {
        data.category = editingItem.name || "";
        data.maxSpend = editingItem.max?.toString() || "";
      } else if (type === "pot") {
        data.name = editingItem.name || "";
        data.target = editingItem.target?.toString() || "";
      }

      setFormData(data);
    } else {
      // Reset to initial state
      const initialData = {
        theme:
          availableThemeColors[0]?.value || currentConfig.themeColors[0]?.value,
      };

      currentConfig.fields.forEach((field) => {
        initialData[field.name] = "";
      });

      setFormData(initialData);
    }
  }, [isOpen, editingItem, type, currentConfig, availableThemeColors]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Validate required fields
      const requiredFields = currentConfig.fields.filter((f) => f.required);
      const missingFields = requiredFields.filter(
        (field) => !formData[field.name]
      );

      if (missingFields.length > 0) {
        alert(
          `Please fill in all required fields: ${missingFields
            .map((f) => f.label)
            .join(", ")}`
        );
        return;
      }

      // Prepare item data based on type
      let itemData = {
        id: editingItem ? editingItem.id : Date.now(),
        color: `bg-${formData.theme}`,
      };

      if (type === "budget") {
        itemData.name = formData.category;
        itemData.max = parseFloat(formData.maxSpend);
        itemData.spend = editingItem?.spend || 0;
      } else if (type === "pot") {
        itemData.name = formData.name;
        itemData.target = parseFloat(formData.target);
        itemData.saved = editingItem?.saved || 0;
        itemData.description = formData.name;
        itemData.createdAt = editingItem
          ? editingItem.createdAt
          : new Date().toISOString().split("T")[0];
        itemData.progressColor = getColorHex(formData.theme);
      }

      onSave(itemData);
      onClose();
    },
    [formData, editingItem, onSave, onClose, type, currentConfig]
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const selectedColor = useMemo(
    () => currentConfig.themeColors.find((c) => c.value === formData.theme),
    [formData.theme, currentConfig.themeColors]
  );

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
                {typeof currentConfig.title === "function"
                  ? currentConfig.title(!!editingItem)
                  : currentConfig.title}
              </h2>
              <p className="text-text/70 text-sm mt-1">
                {currentConfig.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
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
              {/* Dynamic Fields */}
              {currentConfig.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === "select" ? (
                    <div className="relative">
                      <select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                        required={field.required}
                      >
                        <option
                          className="bg-background text-foreground"
                          value=""
                        >
                          {field.placeholder ||
                            `Select ${field.label.toLowerCase()}`}
                        </option>
                        {field.options.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-background text-foreground"
                          >
                            {option}
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
                  ) : (
                    <div className="relative">
                      {field.prefix && (
                        <span className="absolute left-3 top-3.5 text-text/50">
                          {field.prefix}
                        </span>
                      )}
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        min={field.min || "0"}
                        step={field.step || "0.01"}
                        className={`w-full rounded-lg border border-text/20 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all py-3 ${
                          field.prefix ? "pl-8 pr-4" : "px-4"
                        }`}
                        required={field.required}
                        autoFocus={field.autoFocus}
                      />
                    </div>
                  )}
                </div>
              ))}

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

                {/* Color Preview */}
                <div className="mt-3 flex items-center gap-3 p-3 rounded-lg border border-text/10 bg-background/50">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{
                      backgroundColor:
                        selectedColor?.hex || getColorHex(formData.theme),
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {selectedColor?.name || "Color"}
                    </p>
                    <p className="text-xs text-text/70">
                      Preview of selected theme
                    </p>
                  </div>
                </div>

                {availableThemeColors.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-2">
                    All theme colors are already used. Please edit an existing
                    item to change its color.
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
                className="flex-1 px-4 py-3 rounded-lg bg-foreground hover:bg-foreground/90 dark:hover:bg-primary/20 dark:hover:text-foreground transition-all hover:cursor-pointer text-background font-semibold shadow-lg hover:shadow-xl active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={availableThemeColors.length === 0 && !editingItem}
              >
                {typeof currentConfig.saveButtonText === "function"
                  ? currentConfig.saveButtonText(!!editingItem)
                  : currentConfig.saveButtonText}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
