import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

type Expense = {
  id: number;
  title: string;
  amount: number;
};

const fakeExpenses: Expense[] = [
  // make some expenses for me
  { id: 1, title: 'Groceries', amount: 50 },
  { id: 2, title: 'Utilities', amount: 100 },
  { id: 3, title: 'Rent', amount: 1000 },
];

const createPostSchema = z.object({
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

export const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post('/', zValidator('json', createPostSchema), async (c) => {
    const expense = await c.req.valid('json');
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    return c.json(expense);
  });
