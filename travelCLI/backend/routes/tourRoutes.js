const express = require('express');
const router = express.Router();
const { getAllTour, filterTours, updateAllTour, getTour} = require('../controllers/tourControllers');

router.get('/', getAllTour); // Route để lấy danh sách các tour
router.post('/filter', filterTours)
router.post('/updateAllTour', updateAllTour) // Route để cập nhật tất cả tour
router.get('/:id', getTour); // Route để lấy thông tin chi tiết của một tour theo ID

module.exports = router;