import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const token = req.headers.token || req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Login again.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token data',
      });
    }

    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

export default authUser;
