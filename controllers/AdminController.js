const Category = require("../models/Category");

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard", {
      title: "Panggonan.id | Dashboard",
    });
  },

  //startpoint CRUD category
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      // console.log(category);
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Panggonan.id | Category",
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      // console.log(name);
      await Category.create({ name });
      req.flash("alertMassage", "Success Add Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMassage", "$error.massage");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      // console.log(id);
      const category = await Category.findOne({ _id: id });
      // console.log(category);
      category.name = name;
      await category.save();
      req.flash("alertMassage", "Success Update Category");
      req.flash("alertStatus", "warning");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMassage", "$error.massage");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash("alertMassage", "Success Delete Category");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMassage", "$error.massage");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  //endpoint CRUD category

  // startpoint CRUD bank
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      // console.log(bank);
      res.render("admin/bank/view_bank", {
        bank,
        alert,
        title: "Panggonan.id | Bank",
      });
    } catch (error) {
      res.redirect("/admin/bank");
    }
  },

  
  // endpoint CRUD bank

  viewItem: (req, res) => {
    res.render("admin/item/view_item");
  },

  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking");
  },
};
