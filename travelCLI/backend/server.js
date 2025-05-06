const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/travelDB') // hoặc URI của bạn
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
