// server/salaryAdvances.js
const express = require('express');
const router = express.Router();
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

// Get all advances for a guard
router.get('/guards/:id/salary-advances', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM salary_advances WHERE guard_id = $1 ORDER BY advance_date DESC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch advances' });
  }
});

// Add a new advance
router.post('/salary-advances', async (req, res) => {
  const { guard_id, amount, advance_date, recovery_amount_per_cycle } = req.body;
  try {
    const id = uuidv4();
    await db.query(
      `INSERT INTO salary_advances 
       (id, guard_id, amount, advance_date, recovery_amount_per_cycle, total_recovered, recovery_cycles_completed, is_fully_recovered) 
       VALUES ($1, $2, $3, $4, $5, 0, 0, false)`,
      [id, guard_id, amount, advance_date, recovery_amount_per_cycle]
    );
    res.status(201).json({ message: 'Advance recorded.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add advance' });
  }
});

// Process recovery for all advances of a guard
router.put('/guards/:id/salary-advances/recover', async (req, res) => {
  const guardId = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM salary_advances 
       WHERE guard_id = $1 AND is_fully_recovered = false`,
      [guardId]
    );

    const advances = result.rows;

    for (const adv of advances) {
      const remaining = adv.amount - adv.total_recovered;
      const deduction = Math.min(remaining, adv.recovery_amount_per_cycle);
      const newTotal = adv.total_recovered + deduction;
      const newCycles = adv.recovery_cycles_completed + 1;
      const isRecovered = newTotal >= adv.amount;

      await db.query(
        `UPDATE salary_advances 
         SET total_recovered = $1, 
             recovery_cycles_completed = $2, 
             is_fully_recovered = $3 
         WHERE id = $4`,
        [newTotal, newCycles, isRecovered, adv.id]
      );
    }

    res.json({ message: 'Advance recovery processed.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process recovery' });
  }
});

module.exports = router;