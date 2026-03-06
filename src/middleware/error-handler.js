export function notFound(req, res, next) {
  res.status(404).render("errors/404", { title: "Not Found" });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;

  // Don’t leak stack traces in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong."
      : err.message;

  res.status(status).render("errors/500", {
    title: "Server Error",
    status,
    message,
  });
}