"use client";

import { BiHide, BiShow } from "react-icons/bi";
import { useState } from "react";

export default function PasswordInput({
  id,
  name,
  placeholder,
  label,
  value,
  onChange,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>

      <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="flex-1 p-2 focus:outline-none"
          value={value}
          onChange={onChange}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="px-2 text-text cursor-pointer"
        >
          {show ? (
            <BiHide className="text-2xl" />
          ) : (
            <BiShow className="text-2xl" />
          )}
        </button>
      </div>
    </div>
  );
}
