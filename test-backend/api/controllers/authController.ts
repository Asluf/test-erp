import { Request, Response } from "express";
import User from "../schemas/userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/userModel";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name: name, email:email, password: hashedPassword });
    await user.save();
    res.send({ success: true, message: "User created" });
  } catch (error) {
    res.send({ success: false, message: "An unknown error occurred" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({ success: false, message: "Invalid password" });
    }
    let token = null;
    if (user.role === UserRole.SUPER_ADMIN) {
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "24h",
      });
    }
    if (user.role === UserRole.SALES_REP) {
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
    }
    
    res.send({ success: true, token: token, userId: user._id, userRole: user.role });
  } catch (error) {
    res.send({ success: false, message: "An unknown error occurred" });
  }
};

export { signup, login };
