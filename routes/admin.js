const router = require('express').Router();
const adminController = require('../controllers/AdminController');
const {upload} = require('../middlewares/multer');

// startpoint dashboard
router.get('/dashboard', adminController.viewDashboard);
//endpoint dashboard

//startpoint CRUD category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);
//endpoint CRUD category

//startpoint CRUD category
router.get('/bank', adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);
//endpoint CRUD category



router.get('/item', adminController.viewItem);
router.get('/booking', adminController.viewBooking);


module.exports = router;