export function getHome(req, res) {
  res.render("index", {
    title: "Car Dealership",
  });
}