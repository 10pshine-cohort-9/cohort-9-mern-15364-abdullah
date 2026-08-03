import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repositories/authRepository.js";
import { generateToken } from "../utils/generateToken.js";
import appError from "../utils/appError.js";

export async function registerUser(fullName, email, password) {
  
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new appError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  const user = await createUser(fullName, email, hashedPassword);

  return user;
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new appError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new appError("Invalid email or password", 401);
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
    throw new appError("User not found", 404);
  }

  return user;
}
