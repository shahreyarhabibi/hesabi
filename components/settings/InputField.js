// components/settings/InputField.jsx
"use client";

import { memo } from "react";

const InputField = memo(function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
  disabled = false,
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-text/20 bg-input-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
});

export default InputField;
