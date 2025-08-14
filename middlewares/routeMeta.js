function routeMeta(meta) {
  return (req, res, next) => {
    req.meta = meta;
    next();
  };
}

module.exports = routeMeta;