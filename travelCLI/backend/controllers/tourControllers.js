const Tour = require('../controllers/tourControllers');

// Create new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update tour
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
