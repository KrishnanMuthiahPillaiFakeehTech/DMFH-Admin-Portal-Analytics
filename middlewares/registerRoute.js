const asyncHandler = require('./asyncHandler');
const routeMeta = require('./routeMeta');

function registerRoute(app, method, path, meta, handler) {
  app[method](path, routeMeta(meta), asyncHandler(handler));
}

module.exports = registerRoute;