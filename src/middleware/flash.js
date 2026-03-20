/**
 * Session-based flash middleware — no external dependencies.
 *
 * Usage in a controller:
 *   req.flash('success', 'Vehicle added!')   // set
 *
 * In a view (via res.locals.flash):
 *   flash.forEach(f => f.type, f.message)    // read (auto-cleared)
 */
export function flashMiddleware(req, res, next) {
  // Writer: attach req.flash(type, message) helper
  req.flash = function (type, message) {
    if (!req.session) return;
    if (!req.session._flash) req.session._flash = [];
    req.session._flash.push({ type, message });
  };

  // Reader: expose messages to views, then clear them
  res.locals.flash = req.session._flash || [];
  req.session._flash = [];

  next();
}
