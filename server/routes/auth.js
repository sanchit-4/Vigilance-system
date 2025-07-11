const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'guard' } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create corresponding guard record
    const { data: guardData, error: guardError } = await supabase
      .from('guards')
      .insert([{
        user_id: authData.user.id,
        name,
        role,
        date_of_joining: new Date().toISOString().split('T')[0],
        base_salary: 15000,
        category: 'Guard',
        is_active: true
      }])
      .select()
      .single();

    if (guardError) {
      // If guard creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: guardError.message });
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        guard_id: guardData.id,
        role: guardData.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: guardData, error } = await supabase
      .from('guards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: userId,
      guard_id: guardData.id,
      name: guardData.name,
      role: guardData.role,
      category: guardData.category,
      is_active: guardData.is_active,
      base_salary: guardData.base_salary,
      date_of_joining: guardData.date_of_joining
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;