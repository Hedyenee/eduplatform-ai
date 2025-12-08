const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { resolveRole } = require('../utils/role');

// Ensure routes are accessed only with a valid Bearer token
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Pas de token, acces refuse' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role || resolveRole(decoded.email, 'user');
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Restrict access to admin users
const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  const resolvedRole = resolveRole(user.email, user.role);
  if (user.role !== resolvedRole) {
    user.role = resolvedRole;
    await user.save();
  }

  if (resolvedRole !== 'admin') {
    return res.status(403).json({ message: 'Acces admin requis' });
  }

  req.userRole = resolvedRole;
  return next();
});

module.exports = { protect, requireAdmin };
