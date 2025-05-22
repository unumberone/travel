const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post( '/login', loginUser ) // Route để lấy danh sách các tour
// router.get('count', getTourCount); // Route để lấy số lượng tour
// router.get('/getLimitTour', getlimitTour); // Route để lấy danh sách tour với phân trang

module.exports = router;