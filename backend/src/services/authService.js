import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repositories/authRepository.js";
import { generateToken } from "../utils/generateToken.js";

export async function registerUser(fullName, email, password) {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  const user = await createUser(fullName, email, hashedPassword);

  return user;
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User doesnt exist");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    },
  };
}

export async function getUserProfile(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
