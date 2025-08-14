function errorHandler(err, req, res, _next) {
  const route = `${req.method} ${req.originalUrl}`;
  const routeName = req.meta?.name || 'Unknown Route';

  console.error(`❌ [${routeName}] ${route}`);
  console.error(`   → Error: ${err.message}`);
  if (err.stack) console.error(`   → Stack:\n${err.stack}`);

  // GA quota exceeded
  if (err.code === 8 || err.message.includes('RESOURCE_EXHAUSTED')) {
    return res.status(429).json({
      error: 'Google Analytics quota exceeded. Please try again later.',
      code: 'RESOURCE_EXHAUSTED',
      route: routeName,
      message: err.message,
      stack: err.stack
    });
  }

  // General error
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    route: routeName,
    stack: err.stack
  });
}

module.exports = errorHandler;