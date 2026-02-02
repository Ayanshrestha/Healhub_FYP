const allowRoles = (...roles) => {
  const flattenedRoles = roles.flat();
  return (req, res, next) => {
    if (!req.user || !flattenedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission.",
      });
    }
    next();
  };
};

export default allowRoles;
