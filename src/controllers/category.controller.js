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
    res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
}

export async function showEditCategoryForm(req, res, next) {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) return res.status(404).send("Category not found");
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
    await updateCategory(req.params.id, name);
    res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
}

export async function removeCategory(req, res, next) {
  try {
    await deleteCategory(req.params.id);
    res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
}
