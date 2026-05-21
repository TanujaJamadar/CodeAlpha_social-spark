function notFound(req, res, _next) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || res.statusCode !== 200 ? res.statusCode || 500 : 500;
  res.status(status >= 400 ? status : 500).json({
    message: err.message || 'Server error',
  });
}

module.exports = { notFound, errorHandler };
