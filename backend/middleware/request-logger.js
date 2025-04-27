const requestLogger = (req, res, next) => {
    const startTime = process.hrtime(); // High precision time

    // Save the original end method
    const originalEnd = res.end;

    res.end = function (...args) {
        const diff = process.hrtime(startTime);
        const responseTimeMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // ms

        const log = `
  [Request Log]
    ➔ Method      : ${req.method}
    ➔ URL         : ${req.originalUrl}
    ➔ Controller  : ${req.route?.path || "Unknown Route"}
    ➔ Status      : ${res.statusCode}
    ➔ ResponseTime: ${responseTimeMs} ms
    ➔ Time        : ${new Date().toISOString()}
  `;

        console.log(log);
        originalEnd.apply(this, args); // Call original res.end
    };

    next();
};

export default requestLogger;
