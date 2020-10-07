const router = require('express').Router();
const adminController = require('../controllers/AdminController');
const {uploadSingle, uploadMultiple} = require('../middlewares/multer');

// startpoint dashboard
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

// endpoint CRUD item


router.get('/booking', adminController.viewBooking);


module.exports = router;