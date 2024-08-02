import bcrypt from "bcrypt";
import { matchedData, validationResult } from "express-validator";
import User from "../model/UserSchema.js";
import jwt from "jsonwebtoken";

const createToken = ({ _id, email, username }) => {
  return jwt.sign(
    {
      _id,
      email,
      username,
    },
    process.env.SECRET,
    { expiresIn: "3d" }
  );
};

export const signup_user = async (req, res) => {
  const { username, email, password } = matchedData(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    user.save();

    const token = createToken(user);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      token,
      expiresIn: "3d",
      tokenType: "Bearer",
    });
  } catch (error) {
    res.status(500).json({ error: "There was an error." });
  }
};

export const login_user = async (req, res) => {
  const { email, password } = matchedData(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = createToken(user);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      token,
      expiresIn: "3d",
      tokenType: "Bearer",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "There was an error." });
  }
};
