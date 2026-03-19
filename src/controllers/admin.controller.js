export function showAdminDashboard(req, res) {
  res.render("admin/dashboard", {
    title: "Admin Dashboard"
  });
}

export function showEmployeeDashboard(req, res) {
  res.render("admin/employee-dashboard", {
    title: "Employee Dashboard"
  });
}

export function showUserDashboard(req, res) {
  res.render("admin/user-dashboard", {
    title: "User Dashboard"
  });
}