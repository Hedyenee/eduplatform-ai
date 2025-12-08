const adminEmails = (process.env.ADMIN_EMAILS || 'admin@example.com,seeder@example.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const resolveRole = (email, currentRole = 'user') => {
  if (!email) return currentRole || 'user';
  return adminEmails.includes(email.toLowerCase()) ? 'admin' : (currentRole || 'user');
};

module.exports = {
  resolveRole,
  adminEmails,
};
