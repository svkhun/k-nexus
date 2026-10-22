import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_PLAN, transferPlan, todayPlan } from './demoPlan.mjs';

test('today’s spending is added back for the full-day budget and deducted once', () => {
  assert.deepEqual(todayPlan(300), { allowance: 1010.71, remaining: 710.71 });
  assert.equal(todayPlan(30000).remaining, 0);
});

test('a new expense lowers the daily allocation without settling bills', () => {
  const plan = transferPlan({ amount: 1200 });
  assert.equal(plan.beforeDaily, 989.28);
  assert.equal(plan.afterDaily, 903.57);
  assert.equal(plan.remainingBills, 5650);
  assert.equal(plan.projected, 9250);
});

test('paying a reserved bill avoids a second deduction for the same bill', () => {
  for (const amount of [0.01, 1200, 5650]) {
    const plan = transferPlan({ amount, kind: 'bill' });
    assert.equal(plan.afterDaily, plan.beforeDaily);
    assert.equal(plan.remainingBills, DEMO_PLAN.bills - amount);
    assert.equal(plan.projected, 10450);
  }
});

test('blocked recipients and over-balance amounts leave balances and bills unchanged', () => {
  for (const request of [{ amount: 1200, blocked: true }, { amount: 24500.01 }]) {
    const plan = transferPlan({ ...request, kind: 'bill' });
    assert.equal(plan.unavailable, true);
    assert.equal(plan.after, DEMO_PLAN.balance);
    assert.equal(plan.remainingBills, DEMO_PLAN.bills);
    assert.equal(plan.afterDaily, plan.beforeDaily);
  }
});

test('shortfalls produce zero allocation and retain the shortage amount', () => {
  const plan = transferPlan({ amount: 20000 });
  assert.equal(plan.unavailable, false);
  assert.equal(plan.afterDaily, 0);
  assert.equal(plan.reserveShortfall, 6150);
});
