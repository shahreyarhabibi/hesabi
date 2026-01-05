import SectionHeader from "./SectionHeader";
import BillItem from "./BillItem";

export default function RecurringBillsSection({ bills }) {
  return (
    <div className="flex flex-col text-foreground bg-linear-45 from-background to-primary/20 border border-text/10 p-6 gap-5 rounded-2xl">
      <SectionHeader title="Recurring Bills" linkHref="/recurring-bills" />

      <div className="flex flex-col gap-3">
        {bills.map((bill, index) => (
          <BillItem key={index} {...bill} />
        ))}
      </div>
    </div>
  );
}
