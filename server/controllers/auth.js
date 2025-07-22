import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import users from "../models/auth.js";

export const login = async (req, res) => {
  const { name, email } = req.body;
  try {
    const existingUser = await users.findOne({ email });

    const newUser = await users.create({
      name,
      email,
    });
    const token = jwt.sign(
      { email: existingUser.email, id: newUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
