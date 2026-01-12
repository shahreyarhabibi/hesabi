// components/settings/SettingsSkeleton.jsx
"use client";

import { memo } from "react";

const SettingsSkeleton = memo(function SettingsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-5">
        {/* Profile Card Skeleton */}
        <div className="bg-background shadow-xl border border-text/10 rounded-2xl p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6" />

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mt-6" />
        </div>

        {/* Security Card Skeleton */}
        <div className="bg-background shadow-xl border border-text/10 rounded-2xl p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6" />
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>

        {/* Preferences Card Skeleton */}
        <div className="bg-background shadow-xl border border-text/10 rounded-2xl p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"
              />
            ))}
          </div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>

      {/* Save Card Skeleton */}
      <div className="mt-10">
        <div className="bg-background shadow-xl border border-text/10 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SettingsSkeleton;
