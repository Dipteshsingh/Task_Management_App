import userModel from "../models/userModel.js"
import CryptoJS from "crypto-js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


const createToken = (id,role) => {
  return jwt.sign({ id,role }, process.env.JWT_SECRET,{
    expiresIn:'1d'
  })
  
}
// Sign up---
const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'Already have an account'
      });
    }

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;

    // Encrypt password
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.MY_SECRET_KEY).toString();

    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      role: isAdmin ? 'Admin' : 'User' 
    });

    const user = await newUser.save();

    // Create JWT token
    const token = createToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Signup successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};


// Login ---
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.MY_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      return res.json({
        success: false,
        message: 'Invalid password',
      });
    }

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;

    user.role = isAdmin ? 'Admin' : 'User';

    // Create JWT
    const token = createToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, 
    });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password'); 
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
export {signUp,login,getAllUsers}