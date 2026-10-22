// Fixed teaching scenario shared by the showcase, independent of the app session.
export const DEMO_PLAN = Object.freeze({ balance: 24500, bills: 5650, reserve: 5000, days: 14, dailyBudget: 600, savings: 15240 });
const floorCents = value => Math.floor((value + Number.EPSILON) * 100) / 100;

export function todayPlan(spentToday, plan = DEMO_PLAN) {
  const available = plan.balance - plan.bills - plan.reserve;
  // Current balance already includes today's posted spending. Add it back only
  // to establish the full-day allowance, then subtract it once for remaining.
  const allowance = floorCents(Math.max(0, available + spentToday) / plan.days);
  return { allowance, remaining: floorCents(Math.max(0, Math.min(available, allowance - spentToday))) };
}

export function transferPlan({ amount, kind = 'expense', blocked = false }, plan = DEMO_PLAN) {
  const unavailable = blocked || amount > plan.balance;
  const paidBill = unavailable || kind !== 'bill' ? 0 : Math.min(amount, plan.bills);
  const after = unavailable ? plan.balance : plan.balance - amount;
  const remainingBills = plan.bills - paidBill;
  const available = after - remainingBills - plan.reserve;
  return {
    unavailable, after, paidBill, remainingBills,
    beforeDaily: floorCents(Math.max(0, plan.balance - plan.bills - plan.reserve) / plan.days),
    afterDaily: floorCents(Math.max(0, available) / plan.days),
    projected: after - remainingBills - plan.dailyBudget * plan.days,
    reserveShortfall: Math.max(0, -available),
  };
}
