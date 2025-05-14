const express = require('express');
const router = express.Router();
const { getAllTour } = require('../controllers/tourControllers');

router.get('/', getAllTour); // Route để lấy danh sách các tour
// router.get('count', getTourCount); // Route để lấy số lượng tour
// router.get('/getLimitTour', getlimitTour); // Route để lấy danh sách tour với phân trang

module.exports = router;