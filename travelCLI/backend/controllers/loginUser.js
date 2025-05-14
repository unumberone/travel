export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Incorrect password' });

    res.status(200).json({
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        role: user.role // gửi về role luôn
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
