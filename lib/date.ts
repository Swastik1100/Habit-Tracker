export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);

export const getDaysInMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    start: formatDateKey(start),
    end: formatDateKey(end),
  };
};
