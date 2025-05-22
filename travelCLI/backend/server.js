const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const tourRoutes = require('./routes/tourRoutes'); 
const authRoutes = require('./routes/authRoutes')// Import route tours


// Load .env file
dotenv.config();

// Kết nối database
connectDB();

// Khởi tạo ứng dụng Express
const app = express();

// Middleware để parse JSON
app.use(express.json());
app.use(cors());

// Kết nối các route
app.use('/api/tours', tourRoutes);
app.use('/api/auth', authRoutes); // Route cho tours


// Xử lý route không tồn tại
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route không tồn tại' });
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});