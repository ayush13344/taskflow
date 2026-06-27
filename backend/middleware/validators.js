const { body, validationResult } = require("express-validator");

const taskValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Status must be todo, in-progress, or completed"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => tags.every((t) => typeof t === "string"))
    .withMessage("Each tag must be a string"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

module.exports = { taskValidationRules, validate };
