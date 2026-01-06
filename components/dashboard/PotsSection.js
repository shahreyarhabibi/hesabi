import { BsPiggyBank } from "react-icons/bs";
import SectionHeader from "./SectionHeader";
import PotItem from "./PotItem";

export default function PotsSection({ potsData, totalSaved }) {
  return (
    <div className="flex flex-col w-full text-foreground bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 mt-5 p-6 gap-5 rounded-2xl">
      <SectionHeader title="Pots" linkHref="/pots" />

      <div className="flex">
        <div className="flex w-full flex-col gap-5 md:flex-row justify-between">
          {/* Total Saved Card */}
          <div className="flex md:w-xs gap-3 bg-accent/10  items-center p-5  rounded-2xl">
            <BsPiggyBank className="text-5xl text-primary" />
            <div className="flex flex-col">
              <p>Total Saved</p>
              <h3 className="text-foreground text-2xl font-semibold">
                {totalSaved}
              </h3>
            </div>
          </div>

          {/* Pots Grid */}
          <div className="grid grid-cols-2 grid-rows-2">
            {potsData.map((pot) => (
              <PotItem key={pot.name} {...pot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
