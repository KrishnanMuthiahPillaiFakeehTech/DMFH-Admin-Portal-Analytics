function errorHandler(err, req, res, _next) {
  const route = `${req.method} ${req.originalUrl}`;

  console.error(`❌ API Error at ${route}`);
  console.error('Message:', err.message);
  if (err.stack) console.error('Stack:', err.stack);

  // Handle GA quota exceeded
  if (err.code === 8 || err.message.includes('RESOURCE_EXHAUSTED')) {
    return res.status(429).json({
      error: 'Google Analytics quota exceeded',
      route,
      cause: 'RESOURCE_EXHAUSTED',
      message: err.message,
      stack: err.stack
    });
  }

  // Generic error
  res.status(500).json({
    error: 'Internal Server Error',
    route,
    cause: err.code || 'UNKNOWN',
    message: err.message,
    stack: err.stack
  });
}

module.exports = errorHandler;