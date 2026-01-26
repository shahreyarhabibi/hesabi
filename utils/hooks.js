// utils/hooks.js
import { useEffect, useState } from "react";

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useResponsiveItemsPerPage() {
  const getItemsPerPage = () => {
    if (typeof window === "undefined") return 8;

    if (window.innerWidth < 640) return 11; // Mobile
    if (window.innerWidth < 1024) return 9; // Tablet
    return 8; // Desktop
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    // Debounce resize events
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  return itemsPerPage;
}
