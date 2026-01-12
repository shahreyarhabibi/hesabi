// components/settings/MessageAlert.jsx
"use client";

import { memo, useEffect } from "react";

const MessageAlert = memo(function MessageAlert({ message, onClose }) {
  // Auto-close for success messages
  useEffect(() => {
    if (message.type === "success" && message.text) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message.text) return null;

  const alertStyles = {
    success:
      "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400",
    error:
      "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
    info: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
  };

  return (
    <div
      className={`mb-6 p-4 rounded-xl border ${
        alertStyles[message.type] || alertStyles.info
      }`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p>{message.text}</p>
        <button
          onClick={onClose}
          className="text-lg hover:opacity-70 ml-4"
          aria-label="Close message"
        >
          ✕
        </button>
      </div>
    </div>
  );
});

export default MessageAlert;
