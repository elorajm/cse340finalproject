/**
 * Middleware factory that validates a named URL param is a positive integer.
 * Usage: validateId("id")  or  validateId("vehicleId")
 */
export function validateId(paramName = "id") {
  return function (req, res, next) {
    const raw = req.params[paramName];
    const parsed = parseInt(raw, 10);

    if (!raw || isNaN(parsed) || parsed < 1 || String(parsed) !== raw) {
      const err = new Error("Invalid ID.");
      err.status = 400;
      return next(err);
    }

    // Replace the raw string with the parsed integer for downstream use
    req.params[paramName] = parsed;
    next();
  };
}
