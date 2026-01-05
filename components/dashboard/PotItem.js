export default function PotItem({ name, amount, color }) {
  return (
    <div className="flex p-2 gap-3">
      <div className={`h-12.75 w-1 rounded-full ${color}`}></div>
      <p className="text-foreground/80 font-medium flex flex-col gap-1">
        {name}
        <span className="font-bold text-foreground">{amount}</span>
      </p>
    </div>
  );
}
