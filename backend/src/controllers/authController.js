import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../services/authService.js";

export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const user = await registerUser(fullName, email, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await getUserProfile(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message,
    });
  }
}