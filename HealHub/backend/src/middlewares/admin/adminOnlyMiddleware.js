/**
 * Admin Security Middleware check
 */
const adminOnlyMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: "Access denied. System Administrator privileges required."
        });
    }
    next();
};

export default adminOnlyMiddleware;
