const verifyRole = (user) => {
  return user?.role === 'admin';
};

module.exports = verifyRole;
