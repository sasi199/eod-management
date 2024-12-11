
// Middleware to check if a user has permission
const checkPermission = (permission) => {
  return async (req, res, next) => {
    const { role } = req.user;
    console.log("roleeeee",req.user);
    
    try {

      // Check if user has the required permission
      if (permission.every((value) => role.includes(value))) {
        req.role = role
        return next();
      }

      return res.status(403).json({ message: 'Access Denied: You do not have the required permission' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = { checkPermission };