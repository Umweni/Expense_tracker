import User from "../models/User";
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

    } catch (error) {
        
    }
}