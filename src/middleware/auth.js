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
      const err = new Error("You don't have permission to access this page.");
      err.status = 403;
      return next(err);
    }

    next();
  };
}

export function redirectIfLoggedIn(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}