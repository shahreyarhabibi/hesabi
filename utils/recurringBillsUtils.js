// utils/recurringBillsUtils.js

// Format currency
export function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(amount));
}

// Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Get day name from date
function getDayName(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

// Get month abbreviation from date
function getMonthAbbr(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[date.getMonth()];
}

// Format due date based on recurring interval
export function formatDueDate(dateString, recurringInterval) {
  if (!dateString) return "No date";

  const date = new Date(dateString);
  const day = date.getDate();

  switch (recurringInterval) {
    case "daily":
      return "Daily";

    case "weekly":
      const dayName = getDayName(date);
      return `Weekly - ${dayName}`;

    case "monthly":
      return `Monthly - ${getOrdinal(day)}`;

    case "yearly":
      const monthAbbr = getMonthAbbr(date);
      return `Yearly - ${monthAbbr} ${getOrdinal(day)}`;

    default:
      return `Monthly - ${getOrdinal(day)}`;
  }
}

// Filter bills by search term
export function filterBills(bills, searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return bills;
  }

  const search = searchTerm.toLowerCase().trim();

  return bills.filter((bill) => {
    const name = bill.name?.toLowerCase() || "";
    const description = bill.description?.toLowerCase() || "";
    const category = bill.category?.toLowerCase() || "";

    return (
      name.includes(search) ||
      description.includes(search) ||
      category.includes(search)
    );
  });
}

// Sort bills
export function sortBills(bills, sortBy) {
  const sorted = [...bills];

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "date":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getDate() - dateB.getDate();
      });
    case "amount":
      return sorted.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    default:
      return sorted;
  }
}

// Calculate total amount
export function calculateTotalAmount(bills) {
  return bills.reduce((total, bill) => total + Math.abs(bill.amount), 0);
}

// Calculate summary metrics with specific rules:
// - Monthly: paid if current date > bill date, due soon if <= 5 days
// - Weekly: paid if current day > bill day, due soon if <= 2 days
// - Daily: appears in all categories (paid, upcoming, due soon)
// - Yearly: paid if date passed this year, due soon if <= 7 days
export function calculateSummaryMetrics(bills) {
  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const todayDate = today.getDate(); // Day of month (1-31)

  let paidBillsCount = 0;
  let paidBillsAmount = 0;
  let upcomingBillsCount = 0;
  let upcomingBillsAmount = 0;
  let dueSoonBillsCount = 0;
  let dueSoonBillsAmount = 0;

  bills.forEach((bill) => {
    const billDate = new Date(bill.date);
    const amount = Math.abs(bill.amount);
    const interval = bill.recurring_interval || "monthly";

    switch (interval) {
      case "daily":
        // Daily bills count in ALL categories since we pay them every day
        paidBillsCount++;
        paidBillsAmount += amount;
        upcomingBillsCount++;
        upcomingBillsAmount += amount;
        dueSoonBillsCount++;
        dueSoonBillsAmount += amount;
        break;

      case "weekly":
        const billDayOfWeek = billDate.getDay(); // 0-6 (Sun-Sat)

        // Calculate days until next occurrence this week
        // Negative means the day already passed this week
        const daysUntilWeeklyDue = billDayOfWeek - todayDayOfWeek;

        if (daysUntilWeeklyDue < 0) {
          // The day has already passed this week - PAID
          // e.g., bill on Monday (1), today is Tuesday (2): 1 - 2 = -1
          paidBillsCount++;
          paidBillsAmount += amount;
        } else if (daysUntilWeeklyDue === 0) {
          // Due today - count as DUE SOON
          dueSoonBillsCount++;
          dueSoonBillsAmount += amount;
        } else if (daysUntilWeeklyDue <= 2) {
          // Due within 2 days - DUE SOON
          dueSoonBillsCount++;
          dueSoonBillsAmount += amount;
        } else {
          // More than 2 days away - UPCOMING
          upcomingBillsCount++;
          upcomingBillsAmount += amount;
        }
        break;

      case "monthly":
        const billDayOfMonth = billDate.getDate(); // 1-31

        // Calculate days until due this month
        const daysUntilMonthlyDue = billDayOfMonth - todayDate;

        if (daysUntilMonthlyDue < 0) {
          // The date has already passed this month - PAID
          // e.g., bill on 10th, today is 11th: 10 - 11 = -1
          paidBillsCount++;
          paidBillsAmount += amount;
        } else if (daysUntilMonthlyDue === 0) {
          // Due today - count as DUE SOON
          dueSoonBillsCount++;
          dueSoonBillsAmount += amount;
        } else if (daysUntilMonthlyDue <= 5) {
          // Due within 5 days - DUE SOON
          dueSoonBillsCount++;
          dueSoonBillsAmount += amount;
        } else {
          // More than 5 days away - UPCOMING
          upcomingBillsCount++;
          upcomingBillsAmount += amount;
        }
        break;

      case "yearly":
        // Create this year's occurrence date
        const thisYearBillDate = new Date(
          today.getFullYear(),
          billDate.getMonth(),
          billDate.getDate()
        );

        // Calculate days until due
        const timeDiff = thisYearBillDate.getTime() - today.getTime();
        const daysUntilYearlyDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysUntilYearlyDue < 0) {
          // Already passed this year - PAID
          paidBillsCount++;
          paidBillsAmount += amount;
        } else if (daysUntilYearlyDue === 0) {
          // Due today - DUE SOON
          dueSoonBillsCount++;
          dueSoonBillsAmount += amount;
        } else if (daysUntilYearlyDue <= 7) {
          // Due within 7 days - DUE SOON
          dueSoonBillsCount++;
          dueSoonBillsAmount += amount;
        } else {
          // More than 7 days away - UPCOMING
          upcomingBillsCount++;
          upcomingBillsAmount += amount;
        }
        break;

      default:
        // Default to monthly behavior
        const defaultBillDay = billDate.getDate();
        const defaultDaysUntil = defaultBillDay - todayDate;

        if (defaultDaysUntil < 0) {
          paidBillsCount++;
          paidBillsAmount += amount;
        } else if (defaultDaysUntil <= 5) {
          dueSoonBillsCount++;
          dueSoonBillsAmount += amount;
        } else {
          upcomingBillsCount++;
          upcomingBillsAmount += amount;
        }
    }
  });

  return {
    paidBillsCount,
    paidBillsAmount,
    upcomingBillsCount,
    upcomingBillsAmount,
    dueSoonBillsCount,
    dueSoonBillsAmount,
  };
}
