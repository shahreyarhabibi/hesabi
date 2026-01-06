"use client";

import { useState, useEffect, useMemo } from "react";
import { SlMagnifier } from "react-icons/sl";
import {
  FiPlus,
  FiFilter,
  FiGrid,
  FiMoreVertical,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import DashboardLayout from "../dashboard/DashboardLayout";

export default function TransactionsPage() {
  // ======================
  // State Management
  // ======================
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileCategory, setShowMobileCategory] = useState(false);

  const itemsPerPage = 7;

  // ======================
  // Mock Data (Enhanced with more data for pagination)
  // ======================
  const allTransactions = [
    {
      id: 1,
      name: "Ahmad",
      type: "Income",
      category: "Salary",
      date: "19 Aug 2025",
      amount: 1000,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      description: "Monthly salary deposit",
    },
    {
      id: 2,
      name: "Mohammad",
      type: "Expense",
      category: "Groceries",
      date: "20 Sep 2024",
      amount: -500,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammad",
      description: "Weekly grocery shopping",
    },
    {
      id: 3,
      name: "Ali",
      type: "Expense",
      category: "Dining",
      date: "21 Sep 2024",
      amount: -240,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali",
      description: "Dinner at restaurant",
    },
    {
      id: 4,
      name: "Sarah",
      type: "Income",
      category: "Freelance",
      date: "22 Sep 2024",
      amount: 800,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      description: "Freelance project payment",
    },
    {
      id: 5,
      name: "Amazon",
      type: "Expense",
      category: "Shopping",
      date: "23 Sep 2024",
      amount: -350,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amazon",
      description: "Online shopping order",
    },
    {
      id: 6,
      name: "Netflix",
      type: "Expense",
      category: "Entertainment",
      date: "24 Sep 2024",
      amount: -15,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Netflix",
      description: "Monthly subscription",
    },
    {
      id: 7,
      name: "Google",
      type: "Income",
      category: "Freelance",
      date: "25 Sep 2024",
      amount: 1200,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Google",
      description: "Freelance work payment",
    },
    {
      id: 8,
      name: "Uber",
      type: "Expense",
      category: "Transportation",
      date: "26 Sep 2024",
      amount: -45,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uber",
      description: "Ride to airport",
    },
    {
      id: 9,
      name: "Starbucks",
      type: "Expense",
      category: "Dining",
      date: "27 Sep 2024",
      amount: -18,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Starbucks",
      description: "Coffee and snacks",
    },
    {
      id: 10,
      name: "Apple",
      type: "Income",
      category: "Salary",
      date: "28 Sep 2024",
      amount: 1500,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Apple",
      description: "Bonus payment",
    },
    {
      id: 11,
      name: "Shell",
      type: "Expense",
      category: "Transportation",
      date: "29 Sep 2024",
      amount: -75,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shell",
      description: "Gas refill",
    },
    {
      id: 12,
      name: "Spotify",
      type: "Expense",
      category: "Entertainment",
      date: "30 Sep 2024",
      amount: -12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Spotify",
      description: "Music subscription",
    },
    {
      id: 13,
      name: "Microsoft",
      type: "Income",
      category: "Freelance",
      date: "01 Oct 2024",
      amount: 950,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Microsoft",
      description: "Consulting work",
    },
    {
      id: 14,
      name: "Walmart",
      type: "Expense",
      category: "Groceries",
      date: "02 Oct 2024",
      amount: -320,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Walmart",
      description: "Monthly groceries",
    },
    {
      id: 15,
      name: "Disney+",
      type: "Expense",
      category: "Entertainment",
      date: "03 Oct 2024",
      amount: -10,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Disney",
      description: "Streaming service",
    },
  ];

  // ======================
  // Filter & Sort Logic
  // ======================
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.name.toLowerCase().includes(term) ||
          tx.category.toLowerCase().includes(term) ||
          tx.description.toLowerCase().includes(term) ||
          Math.abs(tx.amount).toString().includes(searchTerm)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((tx) => tx.category === categoryFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    // Sort logic
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "amount-high":
        filtered.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        break;
      case "amount-low":
        filtered.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        break;
      case "income-first":
        filtered.sort((a, b) => {
          if (a.type === "Income" && b.type !== "Income") return -1;
          if (a.type !== "Income" && b.type === "Income") return 1;
          return 0;
        });
        break;
      case "expense-first":
        filtered.sort((a, b) => {
          if (a.type === "Expense" && b.type !== "Expense") return -1;
          if (a.type !== "Expense" && b.type === "Expense") return 1;
          return 0;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, sortBy, categoryFilter, typeFilter]);

  // ======================
  // Pagination Logic
  // ======================
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, typeFilter, sortBy]);

  // ======================
  // Helper Functions
  // ======================
  const formatAmount = (amount) => {
    const sign = amount >= 0 ? "+" : "-";
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  const getAmountColor = (amount) => {
    return amount >= 0 ? "text-green-500" : "text-red-500";
  };

  const getTypeBadgeClass = (type) => {
    return type === "Income"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Salary:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Groceries:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Dining: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Shopping:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      Entertainment:
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      Freelance:
        "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
      Transportation:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  // ======================
  // Action Handlers
  // ======================
  const handleViewTransaction = (id) => {
    alert(`Viewing transaction #${id}`);
    setMobileMenuOpen(null);
  };

  const handleEditTransaction = (id) => {
    alert(`Editing transaction #${id}`);
    setMobileMenuOpen(null);
  };

  const handleDeleteTransaction = (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      alert(`Deleted transaction #${id}`);
      setMobileMenuOpen(null);
    }
  };

  const handleAddTransaction = () => {
    alert("Add new transaction form would open here");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTypeFilter("all");
    setSortBy("latest");
    setShowMobileFilter(false);
    setShowMobileCategory(false);
  };

  const toggleMobileMenu = (id) => {
    setMobileMenuOpen(mobileMenuOpen === id ? null : id);
  };

  const closeMobileMenus = () => {
    setMobileMenuOpen(null);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }

      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (start > 1) {
        pageNumbers.unshift("...");
        pageNumbers.unshift(1);
      }

      if (end < totalPages) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // ======================
  // Mobile Filter Components
  // ======================
  const MobileFilterModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={onClose}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 p-6 sm:hidden animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-2">
              <FiX className="text-lg" />
            </button>
          </div>
          {children}
        </div>
      </>
    );
  };

  const renderActiveFilters = () => {
    const activeFilters = [];

    if (searchTerm) {
      activeFilters.push(`Search: "${searchTerm}"`);
    }

    if (categoryFilter !== "all") {
      activeFilters.push(`Category: ${categoryFilter}`);
    }

    if (typeFilter !== "all") {
      activeFilters.push(`Type: ${typeFilter}`);
    }

    if (sortBy !== "latest") {
      const sortLabels = {
        oldest: "Oldest First",
        "amount-high": "Amount: High to Low",
        "amount-low": "Amount: Low to High",
        "income-first": "Income First",
        "expense-first": "Expense First",
      };
      activeFilters.push(`Sort: ${sortLabels[sortBy] || sortBy}`);
    }

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-text/70">Active filters:</span>
        {activeFilters.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {filter}
            <button
              onClick={() => {
                if (filter.startsWith("Search:")) setSearchTerm("");
                else if (filter.startsWith("Category:"))
                  setCategoryFilter("all");
                else if (filter.startsWith("Type:")) setTypeFilter("all");
                else if (filter.startsWith("Sort:")) setSortBy("latest");
              }}
              className="ml-1 text-primary/70 hover:text-primary"
            >
              <FiX className="text-xs" />
            </button>
          </span>
        ))}
        <button
          onClick={clearFilters}
          className="ml-2 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear all
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Header Section - Mobile: Title and button in same row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 px-4 sm:px-6">
        <div className="flex items-center justify-between w-full sm:w-auto sm:block">
          <div className="flex items-center w-full justify-between md:block">
            <h1 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-bold">
              Transactions
            </h1>
            {/* Mobile Add Button */}
            <button
              onClick={handleAddTransaction}
              className="sm:hidden flex items-center gap-1 rounded-lg bg-foreground hover:bg-primary transition-all duration-200 px-3 py-2 font-semibold text-background shadow-lg hover:shadow-xl active:scale-95 text-sm"
            >
              <FiPlus className="text-base" />
              <span>Add</span>
            </button>
          </div>
          <p className="text-text/70 text-sm md:text-base mt-1 hidden sm:block">
            View and manage all your financial transactions
          </p>
        </div>

        {/* Subtitle for mobile */}
        <p className="text-text/70 text-sm sm:hidden w-full mt-2">
          View and manage all your financial transactions
        </p>

        {/* Desktop Add Button */}
        <button
          onClick={handleAddTransaction}
          className="hidden sm:flex items-center gap-2 rounded-lg bg-foreground hover:bg-primary transition-all duration-200 px-5 py-3 font-semibold text-background shadow-lg hover:shadow-xl active:scale-95"
        >
          <FiPlus className="text-xl" />
          Add New Transaction
        </button>
      </div>

      {/* Filters & Table Container */}
      <div className="rounded-xl sm:rounded-2xl border border-text/10 bg-background dark:bg-linear-45 dark:from-background dark:to-primary/20 p-4 sm:p-6 shadow-lg">
        {/* Active Filters Display */}
        {renderActiveFilters()}

        {/* Mobile Filters - Icons only */}
        <div className="sm:hidden flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 pr-12 text-foreground placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Search transactions..."
              />
              <SlMagnifier className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text/50 text-sm" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-text/50 hover:text-foreground"
                >
                  <FiX className="text-sm" />
                </button>
              )}
            </div>

            {/* Mobile Filter Icons */}
            <div className="flex items-center gap-2">
              {/* Sort Icon */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className={`flex items-center gap-1 rounded-lg border ${
                  sortBy !== "latest"
                    ? "border-primary/50 bg-primary/10"
                    : "border-text/20"
                } bg-background dark:bg-gray-900 p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200`}
              >
                <FiFilter className="text-base" />
              </button>

              {/* Category Icon */}
              <button
                onClick={() => setShowMobileCategory(true)}
                className={`flex items-center gap-1 rounded-lg border ${
                  categoryFilter !== "all"
                    ? "border-primary/50 bg-primary/10"
                    : "border-text/20"
                } bg-background dark:bg-gray-900 p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200`}
              >
                <FiGrid className="text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          {/* Search Input */}
          <div className="relative w-full lg:w-auto flex-1 max-w-md">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 pr-12 text-foreground placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all duration-200"
              placeholder="Search transactions, categories, or amounts..."
            />
            <SlMagnifier className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text/50" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-text/50 hover:text-foreground"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Sort Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent min-w-[140px] cursor-pointer transition-all duration-200"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
                <option value="income-first">Income First</option>
                <option value="expense-first">Expense First</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text">Category</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent min-w-[180px] cursor-pointer transition-all duration-200"
              >
                <option value="all">All Categories</option>
                <option value="Salary">Salary</option>
                <option value="Groceries">Groceries</option>
                <option value="Dining">Dining</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Freelance">Freelance</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text">Type</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent min-w-[140px] cursor-pointer transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Modals */}
        <MobileFilterModal
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          title="Sort Options"
        >
          <div className="space-y-3">
            {[
              { value: "latest", label: "Latest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "amount-high", label: "Amount: High to Low" },
              { value: "amount-low", label: "Amount: Low to High" },
              { value: "income-first", label: "Income First" },
              { value: "expense-first", label: "Expense First" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setShowMobileFilter(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  sortBy === option.value
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </MobileFilterModal>

        <MobileFilterModal
          isOpen={showMobileCategory}
          onClose={() => setShowMobileCategory(false)}
          title="Filter by Category"
        >
          <div className="space-y-3">
            <button
              onClick={() => {
                setCategoryFilter("all");
                setShowMobileCategory(false);
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                categoryFilter === "all"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              All Categories
            </button>
            {[
              "Salary",
              "Groceries",
              "Dining",
              "Shopping",
              "Entertainment",
              "Freelance",
              "Transportation",
            ].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setCategoryFilter(category);
                  setShowMobileCategory(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  categoryFilter === category
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </MobileFilterModal>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-xl border border-text/10">
          {currentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No transactions found
              </h3>
              <p className="text-text/70">
                {searchTerm
                  ? `No results for "${searchTerm}". Try a different search term.`
                  : "No transactions match your current filters."}
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-primary hover:text-primary/80 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <table className="w-full">
              {/* Desktop Table Headers */}
              <thead className="hidden sm:table-header-group bg-gray-50 dark:bg-gray-900/50 border-b border-text/10">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-text uppercase tracking-wider">
                    Recipient / Sender
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-text uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-text uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-text uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-text uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-4 px-3 text-left text-sm font-semibold text-text uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Mobile Table Headers */}
              <thead className="sm:hidden bg-gray-50 dark:bg-gray-900/50 border-b border-text/10">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-text uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-text uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-text uppercase tracking-wider w-12">
                    {/* Empty for actions column */}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentTransactions.map((tx) => (
                  <>
                    {/* Desktop Row */}
                    <tr
                      key={`desktop-${tx.id}`}
                      className="hidden sm:table-row hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors duration-150"
                    >
                      {/* Recipient/Sender */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={tx.avatar}
                              className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800"
                              alt={tx.name}
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${
                                tx.type === "Income"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground block">
                              {tx.name}
                            </span>
                            <span className="text-sm text-text/70">
                              {tx.type === "Income"
                                ? "Received from"
                                : "Paid to"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
                            tx.category
                          )}`}
                        >
                          {tx.category}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTypeBadgeClass(
                            tx.type
                          )}`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">
                            {tx.date}
                          </span>
                          <span className="text-sm text-text/70">3:45 PM</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        <div
                          className={`font-semibold text-md ${getAmountColor(
                            tx.amount
                          )}`}
                        >
                          {formatAmount(tx.amount)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewTransaction(tx.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text hover:text-foreground transition-colors"
                            title="View Details"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditTransaction(tx.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text hover:text-foreground transition-colors"
                            title="Edit"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-text hover:text-red-600 transition-colors"
                            title="Delete"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Mobile Row */}
                    <tr
                      key={`mobile-${tx.id}`}
                      className="md:hidden hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors duration-150"
                    >
                      {/* Name + Category */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={tx.avatar}
                              className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                              alt={tx.name}
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                                tx.type === "Income"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                          </div>
                          <div>
                            <div className="font-medium text-foreground text-sm">
                              {tx.name}
                            </div>
                            <div className="text-xs text-text/60 mt-0.5">
                              {tx.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Amount + Date */}
                      <td className="py-3 pl-6">
                        <div
                          className={`font-semibold text-sm ${getAmountColor(
                            tx.amount
                          )}`}
                        >
                          {formatAmount(tx.amount)}
                        </div>
                        <div className="text-xs text-text/60 mt-0.5">
                          {tx.date}
                        </div>
                      </td>

                      {/* Actions - Three dots menu */}
                      <td className="py-3 pl-3 relative">
                        <button
                          onClick={() => toggleMobileMenu(tx.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text hover:text-foreground transition-colors"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>

                        {/* Mobile Action Menu */}
                        {mobileMenuOpen === tx.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40 sm:hidden"
                              onClick={closeMobileMenus}
                            />
                            <div className="absolute right-4 top-8 z-50 bg-background border border-text/20 rounded-lg shadow-lg py-2 w-40 animate-fade-in sm:hidden">
                              <button
                                onClick={() => handleViewTransaction(tx.id)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleEditTransaction(tx.id)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTransaction(tx.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        {currentTransactions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-text/10">
            <div className="text-sm text-text/70">
              Showing{" "}
              <span className="font-medium text-foreground">
                {startIndex + 1}-
                {Math.min(endIndex, filteredTransactions.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredTransactions.length}
              </span>{" "}
              transactions
              {filteredTransactions.length !== allTransactions.length && (
                <span className="ml-2">
                  (filtered from {allTransactions.length} total)
                </span>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-text/70 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-text hover:text-foreground"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
}
