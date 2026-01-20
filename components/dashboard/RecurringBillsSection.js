// components/dashboard/RecurringBillsSection.jsx
import SectionHeader from "./SectionHeader";
import BillItem from "./BillItem";
import { formatCurrency } from "@/lib/constants";

export default function RecurringBillsSection({
  bills = [],
  billsSummary, // ✅ Accept pre-calculated summary
  currency = "USD",
}) {
  const displayBills = [
    {
      name: "Paid Bills",
      amount: formatCurrency(billsSummary.paidBillsAmount, currency),
      count: billsSummary.paidBillsCount,
      color: "bg-emerald-600",
    },
    {
      name: "Total Upcoming",
      amount: formatCurrency(billsSummary.upcomingBillsAmount, currency),
      count: billsSummary.upcomingBillsCount,
      color: "bg-blue-600",
    },
    {
      name: "Due Soon",
      amount: formatCurrency(billsSummary.dueSoonBillsAmount, currency),
      count: billsSummary.dueSoonBillsCount,
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="flex flex-col text-foreground bg-background shadow-xl bg-brand-gradient border border-text/10 p-6 gap-5 rounded-2xl">
      <SectionHeader title="Recurring Bills" linkHref="/recurring-bills" />

      <div className="flex flex-col gap-3">
        {displayBills.map((bill, index) => (
          <BillItem
            key={index}
            name={bill.name}
            amount={bill.amount}
            count={bill.count}
            color={bill.color}
          />
        ))}
      </div>
    </div>
  );
}
