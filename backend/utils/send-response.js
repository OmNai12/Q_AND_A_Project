export const sendResponse = (res, { statusCode = 200, status = 'success', message = '', data = {} }) => {
    res.status(statusCode).json({
        status,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};
