const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, errors: messages });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, error: "Invalid task ID format" });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res
      .status(409)
      .json({ success: false, error: "Duplicate entry detected" });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
