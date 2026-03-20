import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../models/inventory.model.js";

export async function showCategoryList(req, res, next) {
  try {
    const categories = await getAllCategories();
    res.render("admin/categories", { title: "Manage Categories", categories });
  } catch (error) {
    next(error);
  }
}

export async function showAddCategoryForm(req, res) {
  res.render("admin/category-form", {
    title: "Add Category",
    category: null,
    errors: [],
    old: {}
  });
}

export async function addCategory(req, res, next) {
  try {
    const name = (req.body.name || "").trim();
    if (!name) {
      return res.status(400).render("admin/category-form", {
        title: "Add Category",
        category: null,
        errors: [{ msg: "Category name is required." }],
        old: req.body
      });
    }
    await createCategory(name);
    req.flash("success", `Category "${name}" created.`);
    res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
}

export async function showEditCategoryForm(req, res, next) {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      const err = new Error("Category not found.");
      err.status = 404;
      return next(err);
    }
    res.render("admin/category-form", {
      title: "Edit Category",
      category,
      errors: [],
      old: category
    });
  } catch (error) {
    next(error);
  }
}

export async function editCategory(req, res, next) {
  try {
    const name = (req.body.name || "").trim();
    if (!name) {
      const category = await getCategoryById(req.params.id);
      return res.status(400).render("admin/category-form", {
        title: "Edit Category",
        category,
        errors: [{ msg: "Category name is required." }],
        old: req.body
      });
    }
    const existing = await getCategoryById(req.params.id);
    if (!existing) {
      const err = new Error("Category not found.");
      err.status = 404;
      return next(err);
    }
    await updateCategory(req.params.id, name);
    req.flash("success", `Category updated to "${name}".`);
    res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
}

export async function removeCategory(req, res, next) {
  try {
    const existing = await getCategoryById(req.params.id);
    if (!existing) {
      const err = new Error("Category not found.");
      err.status = 404;
      return next(err);
    }
    await deleteCategory(req.params.id);
    req.flash("info", "Category deleted.");
    res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
}
