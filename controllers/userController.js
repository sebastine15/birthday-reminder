const User = require('../models/User');
const { validateUser } = require('../validator/inputValidation');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    // Validate user input
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Extract and normalize fields
    const { username, email, dateOfBirth } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create and save new user
    const user = new User({ username, email: normalizedEmail, dateOfBirth });
    await user.save();

    // Respond with success
    res.status(201).json({
      message: 'User created successfully',
      user
    });

  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
