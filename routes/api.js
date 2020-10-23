    const router = require("express").Router();
    const apiController = require("../controllers/apiController");
    const { uploadSingle } = require("../middlewares/multer");

    // startpoint API landing-page
    router.get("/landing-page", apiController.landingPage);
    
    // startpoint API Detail-page
    router.get("/detail-page/:id", apiController.detailPage);
    
    // startpoint API Booking-page
    router.post("/booking-page", uploadSingle, apiController.bookingPage);
    module.exports = router;