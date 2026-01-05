import BudgetChart from "./BudgetChart";
import SectionHeader from "./SectionHeader";
import PotItem from "./PotItem";

export default function BudgetSection({ budgetCategories }) {
  return (
    <div className="flex flex-col text-foreground bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 p-6 gap-5 rounded-2xl">
      <SectionHeader title="Budget" linkHref="/budget" />

      <div className="flex items-center justify-between gap-2">
        <div className="w-85.5">
          <BudgetChart />
        </div>

        {/* Budget Categories */}
        <div className="flex flex-col gap-2 justify-center">
          {budgetCategories.map((category) => (
            <PotItem key={category.name} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
}
