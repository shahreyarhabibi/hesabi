"use client";
import Header from "@/components/header/Header";
import DashboardLayout from "../dashboard/DashboardLayout";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useState, useCallback, useMemo, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { potsData, themeColors } from "@/data/transactionsData";

// Dummy data for pots

function AddPotModal({
  isOpen,
  onClose,
  onAddPot,
  onUpdatePot,
  editingPot,
  existingPots = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    theme: "teal-600",
  });

  // Get available theme colors (exclude already used ones)
  const availableThemeColors = useMemo(() => {
    const usedColors = existingPots.map((pot) => pot.color);
    return themeColors.filter(
      (color) =>
        !usedColors.includes(color.bgClass) ||
        (editingPot && editingPot.color === color.bgClass)
    );
  }, [existingPots, editingPot]);

  // Reset form when modal opens/closes or editingPot changes
  useEffect(() => {
    if (editingPot) {
      setFormData({
        name: editingPot.name || "",
        target: editingPot.target?.toString() || "",
        theme: editingPot.color?.replace("bg-", "") || "blue-500",
      });
    } else {
      setFormData({
        name: "",
        target: "",
        theme: availableThemeColors[0]?.value || "blue-500",
      });
    }
  }, [editingPot, isOpen, availableThemeColors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target) {
      alert("Please fill in all required fields");
      return;
    }

    const potData = {
      id: editingPot ? editingPot.id : Date.now(),
      name: formData.name,
      target: parseFloat(formData.target),
      color: `bg-${formData.theme}`,
      saved: editingPot?.saved || 0,
      description: formData.name, // Use name as description or add description field
      createdAt: editingPot
        ? editingPot.createdAt
        : new Date().toISOString().split("T")[0],
      progressColor: getColorHex(formData.theme),
    };

    if (editingPot) {
      onUpdatePot(potData);
    } else {
      onAddPot(potData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getColorHex = (colorClass) => {
    const color = themeColors.find((c) => c.value === colorClass);
    return color ? color.hex : "#3B82F6";
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
                {editingPot ? "Edit Pot" : "Add New Pot"}
              </h2>
              <p className="text-text/70 text-sm mt-1">
                Set up a new savings pot to track your progress towards a goal.
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
              {/* Pot Name Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pot Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Laptop, Vacation, Emergency Fund"
                  className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  autoFocus
                />
              </div>

              {/* Target Amount Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-text/50">
                    $
                  </span>
                  <input
                    type="number"
                    name="target"
                    value={formData.target}
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
                    className="w-8 h-8 rounded-full"
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
                    pot to change its color.
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
                disabled={availableThemeColors.length === 0 && !editingPot}
              >
                {editingPot ? "Update Pot" : "Add Pot"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PotsPage() {
  const [pots, setPots] = useState(potsData);
  const [isPotModalOpen, setIsPotModalOpen] = useState(false);
  const [editingPot, setEditingPot] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Calculate progress percentage
  const calculateProgress = (saved, target) => {
    return Math.min((saved / target) * 100, 100);
  };

  // Format percentage
  const formatPercentage = (saved, target) => {
    return ((saved / target) * 100).toFixed(1);
  };

  // Handle add money to pot
  const handleAddMoney = (potId) => {
    const amount = prompt(
      `How much would you like to add to ${
        pots.find((p) => p.id === potId)?.name
      }?`
    );
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      setPots((prev) =>
        prev.map((pot) =>
          pot.id === potId
            ? { ...pot, saved: pot.saved + parseFloat(amount) }
            : pot
        )
      );
      alert(
        `Successfully added $${amount} to ${
          pots.find((p) => p.id === potId)?.name
        }!`
      );
    }
  };

  // Handle withdraw from pot
  const handleWithdraw = (potId) => {
    const pot = pots.find((p) => p.id === potId);
    const amount = prompt(
      `How much would you like to withdraw from ${
        pot?.name
      }? (Current: $${pot?.saved.toFixed(2)})`
    );
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      if (parseFloat(amount) > pot.saved) {
        alert("Cannot withdraw more than the saved amount!");
        return;
      }
      setPots((prev) =>
        prev.map((p) =>
          p.id === potId ? { ...p, saved: p.saved - parseFloat(amount) } : p
        )
      );
      alert(`Successfully withdrew $${amount} from ${pot?.name}!`);
    }
  };

  // Handle pot operations
  const handleAddPot = useCallback((newPot) => {
    setPots((prev) => [...prev, newPot]);
    setIsPotModalOpen(false);
    console.log("Adding pot:", newPot);
  }, []);

  const handleUpdatePot = useCallback((updatedPot) => {
    setPots((prev) =>
      prev.map((pot) => (pot.id === updatedPot.id ? updatedPot : pot))
    );
    setIsPotModalOpen(false);
    setEditingPot(null);
    console.log("Updating pot:", updatedPot);
  }, []);

  const handleDeletePot = useCallback((potId) => {
    if (confirm("Are you sure you want to delete this pot?")) {
      setPots((prev) => prev.filter((pot) => pot.id !== potId));
      setOpenDropdownId(null);
      alert("Pot deleted successfully!");
    }
  }, []);

  const handleEditPot = useCallback((pot) => {
    setEditingPot(pot);
    setIsPotModalOpen(true);
    setOpenDropdownId(null);
  }, []);

  const handleDropdownToggle = useCallback((potId) => {
    setOpenDropdownId((prev) => (prev === potId ? null : potId));
  }, []);

  const handleClickOutside = useCallback(() => {
    setOpenDropdownId(null);
  }, []);

  const handleOpenModal = useCallback(() => {
    setEditingPot(null);
    setIsPotModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsPotModalOpen(false);
    setEditingPot(null);
  }, []);

  return (
    <DashboardLayout>
      <Header
        buttonText={"Add New Pot"}
        pageHeader={"Pots"}
        pageSubHeader={"Manage your savings pots"}
        onAdd={handleOpenModal}
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-20 gap-6"
        onClick={handleClickOutside}
      >
        {pots.map((pot) => {
          const progressPercentage = calculateProgress(pot.saved, pot.target);
          const formattedPercentage = formatPercentage(pot.saved, pot.target);

          return (
            <div
              key={pot.id}
              className="bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 p-5 md:p-8 rounded-2xl"
            >
              {/* Pot Header */}
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${pot.color}`}></div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold">
                      {pot.name}
                    </h2>
                    <p className="text-sm text-text/70">{pot.description}</p>
                  </div>
                </div>

                {/* Three dots with dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDropdownToggle(pot.id);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Pot options"
                  >
                    <BiDotsHorizontalRounded className="text-2xl md:text-3xl" />
                  </button>

                  {/* Dropdown menu */}
                  {openDropdownId === pot.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-background border border-text/10 rounded-lg shadow-lg z-10 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPot(pot);
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
                        Edit Pot
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePot(pot.id);
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
                        Delete Pot
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pot Content */}
              <div className="flex flex-col w-full mt-6 md:mt-8 gap-5">
                {/* Total Saved */}
                <p className="flex justify-between w-full items-center">
                  <span className="text-text/70">Total Saved:</span>
                  <span className="text-xl md:text-2xl font-bold">
                    ${pot.saved.toLocaleString()}
                  </span>
                </p>

                {/* Progress Bar */}
                <div>
                  <div
                    data-testid="progress-bar-container"
                    className="h-3 w-full px-1 bg-foreground/10 dark:bg-background/70 rounded-md flex items-center"
                  >
                    <div
                      data-testid="progress-bar"
                      className="h-2 rounded-md transition-all duration-300 ease-in-out"
                      style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: pot.progressColor,
                      }}
                    />
                  </div>
                  <p className="flex justify-between mt-2 font-bold text-sm">
                    <span>{formattedPercentage}%</span>
                    <span className="font-normal text-text">
                      of ${pot.target.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleAddMoney(pot.id)}
                    className="flex-1 justify-center flex items-center gap-2 rounded-lg bg-primary/20 hover:bg-foreground/90 dark:hover:text-background transition-all hover:cursor-pointer duration-200 px-4 py-3 md:px-5 md:py-5 font-semibold text-foreground shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="hidden sm:inline">Add Money</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                  <button
                    onClick={() => handleWithdraw(pot.id)}
                    className="flex-1 justify-center flex items-center gap-2 rounded-lg bg-foreground hover:bg-primary/20 dark:hover:bg-primary/20 dark:hover:text-foreground transition-all hover:cursor-pointer duration-200 px-4 py-3 md:px-5 md:py-5 font-semibold text-background shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                    <span className="hidden sm:inline">Withdraw</span>
                    <span className="sm:hidden">Withdraw</span>
                  </button>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-text/10">
                  <p className="text-sm text-text/70">
                    Started on{" "}
                    {new Date(pot.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-text/70 ">
                    ${(pot.target - pot.saved).toLocaleString()} left to reach
                    target
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Pot Modal */}
      <AddPotModal
        isOpen={isPotModalOpen}
        onClose={handleCloseModal}
        onAddPot={handleAddPot}
        onUpdatePot={handleUpdatePot}
        editingPot={editingPot}
        existingPots={pots}
      />
    </DashboardLayout>
  );
}
