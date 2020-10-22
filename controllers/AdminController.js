const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const Booking = require("../models/Booking");
const Member = require("../models/Member");
const Users = require("../models/Users");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async(req, res) => {
try {
  const alertMassage = req.flash("alertMassage");
  const alertStatus = req.flash("alertStatus");
  const alert = { massage: alertMassage, status: alertStatus };
  if (req.session.user == null || req.session.user == undefined) {
    req.flash("alertMassage","Session telah habis silahkan signin kembali !!!");
    req.flash("alertStatus", "danger");
    res.render("index", {
      alert,
      title: "Panggonan.id | Login",
    });
  } else {
  res.redirect("/admin/dashboard");
  }
} catch (error) {
  res.redirect("/admin/signin");
}
},

actionSigin: async(req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if(!user) {
      req.flash("alertMassage", "User yang anda masukkan tidak ada !!!");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/signin");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
      req.flash("alertMassage", "Password yang anda masukkan tidak cocok !!!");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/signin");  
      }

      req.session.user = {
        id: user.id,
        username: user.username
      }

      res.redirect('/admin/dashboard');

    } catch (error) {
      res.redirect("/admin/signin");  
      
    }
  },

  actionLogout: async(req, res) => {
    req.session.destroy();
    res.redirect('/admin/signin');
  },
  
  viewDashboard: async (req, res) => {
    try {
      const member =  await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("admin/dashboard/view_dashboard", {
        title: "Panggonan.id | Dashboard",
        user: req.session.user,
        member,
        booking,
        item
      });
      
    } catch (error) {
          res.redirect('/admin/dashboard');
    }
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
        user: req.session.user,
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
        user: req.session.user,
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

  // startpoint CRUD Item
  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      // console.log(item);
      const category = await Category.find();
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Panggonan.id | Item",
        category,
        alert,
        item,
        action: "view",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, country, city, about } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId,
          title,
          description: about,
          price,
          country,
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMassage", "Success Add Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Panggonan.id | Show Image Item",
        alert,
        item,
        action: "show image",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      // console.log(item);
      const category = await Category.find();
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Panggonan.id | Edit Item",
        alert,
        item,
        category,
        action: "edit",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, country, city, about } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });

      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({
            _id: item.imageId[i]._id,
          });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.country = country;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMassage", "Success Update Item");
        req.flash("alertStatus", "warning");
        res.redirect("/admin/item");
      } else {
        item.title = title;
        item.price = price;
        item.country = country;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMassage", "Success Update Item");
        req.flash("alertStatus", "warning");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMassage", `${error.massage}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          });
      }
      await item.remove();
      req.flash("alertMassage", "Success Delete Item");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };

      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });

      res.render("admin/item/detail_item/view_detail_item", {
        title: "Panggonan.id | Detail Item",
        alert,
        itemId,
        feature,
        activity,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  // endpoint CRUD Item

  // startpoint CRUD Feature
  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    console.log(itemId);
    try {
      if (!req.file) {
        req.flash("alertMassage", "Image not found");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash("alertMassage", "Success Add Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMassage", "Success Update Feature");
        req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        req.flash("alertMassage", "Success Update Feature");
        req.flash("alertStatus", "warning");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    const { id,itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });
      const item = await Item.findOne({_id: itemId}).populate('featureId');
      for(let i = 0; i < item.featureId.length;i++) {
        if(item.featureId[i]._id.toString() === feature._id.toString() ) {
          item.featureId.pull({_id : feature._id});
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash("alertMassage", "Success Delete Feature");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  // endpoint CRUD Feature

 // startpoint CRUD Activity
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMassage", "Image not found");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save()
      req.flash("alertMassage", "Success Add Activity");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash("alertMassage", "Success Update Activity");
        req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
        req.flash("alertMassage", "Success Update Activity");
        req.flash("alertStatus", "warning");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    const { id,itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({_id: itemId}).populate('activityId');
      for(let i = 0; i < item.activityId.length;i++) {
        if(item.activityId[i]._id.toString() === activity._id.toString() ) {
          item.activityId.pull({_id : activity._id});
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash("alertMassage", "Success Delete Activity");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  // endpoint CRUD Activity

  // startpoint CRUD Booking
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
      .populate('memberId')
      .populate('bankId');
      res.render("admin/booking/view_booking", {
        title: "Panggonan.id | Booking",
                user: req.session.user,
                booking
      }); 
    } catch (error) {
      res.redirect('/admin/booking');
    }
  },

  showDetailBooking: async (req, res) => {
    const { id } = req.params;

    try {
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };

    const booking = await Booking.findOne({ _id: id })
      .populate("memberId")
      .populate("bankId");

      // console.log(booking);
       res.render("admin/booking/show_detail_booking", {
         title: "Panggonan.id | Detail Booking",
         user: req.session.user,
         booking,
         alert
       });      
    } catch (error) {
      res.redirect('/admin/booking');
    }
  },

  actionConfirmation: async(req, res) => {
const { id } = req.params
    try {
  const booking = await Booking.findOne({_id:id});
  booking.payments.status = 'Accept';
  await booking.save();
  req.flash("alertMassage", "Success Payment Confirmation");
  req.flash("alertStatus", "success");
  res.redirect(`/admin/booking/${id}`);  
} catch (error) {
  res.redirect(`/admin/booking/${id}`);  
}
  },

  actionReject: async(req, res) => {
const { id } = req.params
    try {
  const booking = await Booking.findOne({_id:id});
  booking.payments.status = 'Reject';
  await booking.save();
  req.flash("alertMassage", "Payment Rejected");
  req.flash("alertStatus", "danger");
  res.redirect(`/admin/booking/${id}`);  
} catch (error) {
  res.redirect(`/admin/booking/${id}`);  
}
  },
};
