import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
};

export const isTokenInvalidated = async (token, userId) => {
  try {
    const user = await User.findById(userId).select('+refreshToken');
    return user.refreshToken !== token;
  } catch (error) {
    return true;
  }
};