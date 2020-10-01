const router = require('express').Router();
const adminController = require('../controllers/AdminController');

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

//endpoint CRUD category



router.get('/item', adminController.viewItem);
router.get('/booking', adminController.viewBooking);


module.exports = router;