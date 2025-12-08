const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { resolveRole } = require('../utils/role');

const toPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role || 'user',
});

// @desc Register new user
// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = resolveRole(email, 'user');

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Générer le token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Login user
// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const resolvedRole = resolveRole(user.email, user.role);
    if (user.role !== resolvedRole) {
      user.role = resolvedRole;
      await user.save();
    }

    // Générer le token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: resolvedRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get current authenticated user
// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    res.json(toPublicUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
