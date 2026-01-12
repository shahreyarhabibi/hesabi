// components/ui/DeleteConfirmationModal.jsx
"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertTriangle } from "react-icons/fi";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Transaction",
  message = "Are you sure you want to delete this transaction? This action cannot be undone.",
  itemName = "",
  isLoading = false,
}) {
  const handleConfirm = () => {
    onConfirm();
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
          className="bg-background rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-text/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-foreground text-lg font-bold">{title}</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <p className="text-text/80 text-sm leading-relaxed">{message}</p>

            {itemName && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 truncate">
                  "{itemName}"
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-5 pt-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-text/20 hover:border-text/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                  Deleting...
                </>
              ) : (
                <>
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
                  Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(DeleteConfirmationModal);
