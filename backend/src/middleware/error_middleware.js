function errorHandler(err, req, res, next) {
  console.error(err);

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors
    });
  }

  // Handle Prisma errors
  if (err.code === "P2002") {
    return res.status(409).json({
      message: "Duplicate entry. This record already exists."
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}

module.exports = errorHandler;