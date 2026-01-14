// components/settings/PreferencesCard.jsx
"use client";

import { memo } from "react";
import CurrencySelector from "./CurrencySelector";
import ThemeToggle from "./ThemeToggle";

const PreferencesCard = memo(function PreferencesCard({
  userProfile,
  currencyOptions,
  onCurrencySelect,
}) {
  return (
    <div className="shadow-xl bg-input-background border border-text/10 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">Preferences</h2>

      <CurrencySelector
        currencyOptions={currencyOptions}
        selectedCurrency={userProfile.currency}
        onSelect={onCurrencySelect}
      />

      <ThemeToggle />
    </div>
  );
});

export default PreferencesCard;
