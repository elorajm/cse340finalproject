import { getAllUsers, updateUserRole } from "../models/auth.model.js";

const VALID_ROLES = ["user", "employee", "owner"];

export async function showUserList(req, res, next) {
  try {
    const users = await getAllUsers();
    res.render("admin/users", { title: "Manage Users", users });
  } catch (error) {
    next(error);
  }
}

export async function changeUserRole(req, res, next) {
  try {
    const { role } = req.body;
    const targetId = parseInt(req.params.id, 10);

    // Prevent owner from demoting themselves
    if (targetId === req.session.user.user_id) {
      return res.redirect("/admin/users");
    }

    if (!VALID_ROLES.includes(role)) {
      return res.redirect("/admin/users");
    }

    await updateUserRole(targetId, role);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
}
