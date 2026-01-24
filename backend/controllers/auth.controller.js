import bcrypt from "bcrypt";
import genToken from "../utils/token.js";
import User from "../models/user.model.js";


export const signUp = async (req, res) => {
  try {
    const { fullname, email, password, mobile, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already exiest.." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      email,
      role,
      mobile,
      password: hashedPassword,
    });
   const token = await genToken(newUser._id);
   res.cookie("token", token,{
    secure:false,
    sameSite:'strict',
    maxAge:7*24*60*60*1000,
    httpOnly:true
   });
   return res.status(200).json({ message: "User Created Successfully", newUser });
  } catch (error) {
    return res.status(500).json(`sign up failed ${error}`);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exiest.." });
    }

    const isMatch= await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password.." });
    }

   const token = await genToken(user._id);
   res.cookie("token", token,{
    secure:false,
    sameSite:'strict',
    maxAge:7*24*60*60*1000,
    httpOnly:true
   });
   return res.status(200).json({ message: "User Login Successfully", user });
  } catch (error) {
    return res.status(500).json(`sign in failed ${error}`);
  }
};
    
export const signOut=async(req, res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "User Logout Successfully" });
    } catch (error) {
        return res.status(500).json(`sign out failed ${error}`);
    }
}