export function timeToMinutes(time) {
  if (!time || typeof time !== "string") return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function calculateShiftMinutes(start, end) {
  if (!start || !end) return 0;
  return timeToMinutes(end) - timeToMinutes(start);
}

export function calculateTotalMinutes(shifts) {
  return shifts.reduce((total, shift) => {
    return total + calculateShiftMinutes(shift.start, shift.end);
  }, 0);
}

export function minutesToHours(minutes) {
  return Math.round((minutes / 60) * 100) / 100;
}

export function calculateEarnings(hours, rate, overtime) {
  let regular = hours;
  let overtimeHours = 0;

  if (overtime.enabled && hours > overtime.weeklyLimit) {
    regular = overtime.weeklyLimit;
    overtimeHours = hours - overtime.weeklyLimit;
  }

  return {
    grossPay:
      regular * rate + overtimeHours * rate * overtime.multiplier,
  };
}