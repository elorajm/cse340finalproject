export function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/auth/login");
    }

    if (!allowedRoles.includes(req.session.user.role)) {
      return res.status(403).send("Access denied");
    }

    next();
  };
}