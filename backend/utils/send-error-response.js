export const sendErrorResponse = (res, { statusCode = 500, message = 'Something went wrong' }) => {
    const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    res.status(statusCode).json({
      status,
      message,
      timestamp: new Date().toISOString(),
    });
  };
  