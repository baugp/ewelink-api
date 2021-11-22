/**
 * Return daily power usage
 *
 * @param hundredDaysKwhData
 *
 * @returns {{daily: *, monthly: *}}
 */
const parsePowerUsage = ({ hundredDaysKwhData }, full) => {
  const today = new Date();
  const days = today.getDate();
  const DAYS_MAX = full ? 100 : days;

  let monthlyUsage = 0;
  const dailyUsage = [];

  for (let day = 0; day < DAYS_MAX; day += 1) {
    const s = hundredDaysKwhData.substr(6 * day, 2);
    const c = hundredDaysKwhData.substr(6 * day + 2, 2);
    const f = hundredDaysKwhData.substr(6 * day + 4, 2);
    const h = parseInt(s, 16);
    const y = parseInt(c, 16);
    const I = parseInt(f, 16);
    const E = parseFloat(`${h}.${y}${I}`);
    if (isNaN(E)) {
      continue;
    }

    dailyUsage.push({
      date: (new Date((new Date(today)).setDate(days - day))).toLocaleDateString('en-CA'),
      usage: E,
    });

    // compute only on current month
    if (days - day > 0) {
      monthlyUsage += E;
    }
  }

  return {
    monthly: monthlyUsage,
    daily: dailyUsage,
  };
};

module.exports = parsePowerUsage;
