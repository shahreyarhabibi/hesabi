import Image from "next/image";
import googleImg from "@/public/google.svg";

export default function TransactionRow({ transaction, showBorder = true }) {
  const formatAmount = (amount) => {
    const sign = amount >= 0 ? "+" : "-";
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  const getAmountColor = (amount) => {
    return amount >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div
      className={`flex justify-between pb-3 ${
        showBorder ? "border-b border-text/30" : ""
      }`}
    >
      <div className="flex gap-4  items-center">
        <Image
          className="rounded-full"
          src={googleImg}
          height={30}
          width={30}
          alt={`${transaction.sender} photo`}
        />
        <p>{transaction.sender}</p>
      </div>
      <div>
        <p
          className={`font-bold text-right ${getAmountColor(
            transaction.amount
          )}`}
        >
          {formatAmount(transaction.amount)}
        </p>
        <p className="text-text text-right">{transaction.date}</p>
      </div>
    </div>
  );
}
