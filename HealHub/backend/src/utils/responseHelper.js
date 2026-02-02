/**
 * Response Helper for consistent API responses
 */
const responseHelper = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data
    });
};

export default responseHelper;
