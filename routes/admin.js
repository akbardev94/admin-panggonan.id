const router = require('express').Router();
const adminController = require('../controllers/AdminController');
const {uploadSingle, uploadMultiple} = require('../middlewares/multer');
const auth = require('../middlewares/auth');

// startpoint signin
router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSigin);
router.use(auth);
// startpoint dashboard
router.get('/logout', adminController.actionLogout);
router.get('/dashboard', adminController.viewDashboard);
//endpoint dashboard

//startpoint CRUD category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);
//endpoint CRUD category

//startpoint CRUD bank
router.get('/bank', adminController.viewBank);
router.post("/bank", uploadSingle, adminController.addBank);
router.put("/bank", uploadSingle, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);
//endpoint CRUD bank

//startpoint CRUD item
router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id/delete", adminController.deleteItem);
//endpoint CRUD item

//startpoint detail item / feature
router.get("/item/show-detail-item/:itemId", adminController.viewDetailItem);
router.post("/item/add/feature", uploadSingle, adminController.addFeature);
router.put("/item/update/feature", uploadSingle, adminController.editFeature);
router.delete("/item/:itemId/feature/:id", adminController.deleteFeature);
//endpoint detail item / feature

//startpoint activity
router.post("/item/add/activity", uploadSingle, adminController.addActivity);
router.put("/item/update/activity", uploadSingle, adminController.editActivity);
router.delete("/item/:itemId/activity/:id", adminController.deleteActivity);
//endpoint activity

//startpoint booking
router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);
router.put('/booking/:id/confirmation', adminController.actionConfirmation);
router.put('/booking/:id/reject', adminController.actionReject);
//endpoint booking

module.exports = router;