import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// GENERATE TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//REGISTER USER
export const register = async (req, res) => {
    try {
        const { name, email, password} = req.body;

        if( !name || !email || !password){
            return res.status(400).send({success: 'false', msg: 'fill required field'});
        }

        //check if exist
        const exist = await User.findOne({ email});
        if(exist){
            return res.status(400).send({success: 'false', msg: 'User already exists'});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
         const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            return res.status(201).send({
                success: true,
                message: "User registered successfully",
                user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                },
                 token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid user data" });
            }

    } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: error.message });  
    }
};

    // LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Return user data + token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Login failed" });
  }
};