const Category = require("../models/Category");
const Bank = require("../models/Bank");
const fs = require("fs-extra");
const path = require("path");

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
      req.flash("alertMassage", `${error.massage}`);
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
      req.flash("alertMassage", `${error.massage}`);
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
      req.flash("alertMassage", `${error.massage}`);
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
      res.render("admin/bank/view_bank", {
        title: "Panggonan.id | Bank",
        alert,
        bank,
      });
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  addBank: async (req, res) => {
    try {
      const { name, nameBank, nomorRekening } = req.body;
      // console.log(req.file);
      await Bank.create({
        name,
        nameBank,
        nomorRekening,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMassage", "Success Add Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash("alertMassage", "Success Update Bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMassage", "Success Update Bank");
        req.flash("alertStatus", "warning");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMassage", "Success Delete Bank");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
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
