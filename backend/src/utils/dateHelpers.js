const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isPastDate = (date) => {
  return new Date(date).getTime() < Date.now();
};

module.exports = {
  addDays,
  isPastDate,
};
