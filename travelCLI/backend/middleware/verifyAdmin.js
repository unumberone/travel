export const verifyAdmin = (req, res, next) => {
  const user = req.user; // phải gắn `req.user` từ middleware decode token nếu có

  if (!user || user.role !== 0) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  next();
};
