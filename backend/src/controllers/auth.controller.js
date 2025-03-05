import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utilis.js";
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";
export const signup=async (req,res)=>{
    const {fullname,email,password}=req.body; 
   try {
    if(!fullname || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    if(password.length<6){
       return res.status(400).json({message:"password must be atleast 6 character"})
    }
    const user=await User.findOne({email})
    if(user) return res.status(400).json({message:"Email already exit"});
    
    const salt=await bcryptjs.genSalt(10);
    const hashpassword=await bcryptjs.hash(password,salt);
    const newUser=new User({
        fullname,
        email,
        password:hashpassword
    });
    if(newUser){
        //Generate JWT token 

       generateToken(newUser._id,res);
       await newUser.save();
       res.status(201).json({
        _id:newUser._id,
        fullname:newUser.fullname,
        email:newUser.email,
        profilePic:newUser.profilePic,
       });

    }else{
        res.status(400).json({message:"Invalid User"})
    }
   } catch (error) {
        console.log("Error in signup",error.message);
        res.status(500).json({message:"Invalid server Error"})
   }
};

export const login=async (req,res)=>{
   const {email,password}=req.body;
   try {
    const user=await User.findOne({email});
    if(!user){
        res.status(400).json({message:"Invalid email address"});
    }
    const isPasswordCorrect=await bcrypt.compare(password,user.password); //password- UI and user.password- DB
    if(!isPasswordCorrect){
        res.status(400).json({message:"Invalid password"});
    }
    generateToken(user._id,res);
    res.status(200).json({
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profilePic:user.profilePic
    });
   } catch (error) {
    console.log("Error in signup",error.message);
    res.status(500).json({message:"Invalid server Error"})
   }
}
export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0,httpOnly:true});
        res.status(200).json({message:"Logut successfuly"});
    } catch (error) {
        console.log("Error in logout in controller",error.message);
        res.status(500).json({message:"Internal server Error"});
    }
}

export const updateProfile=async (req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId=req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"profilePic is required"});
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updateUser=await User.findByIdAndUpdate(userId,
            {profilePic:uploadResponse.secure_url},{new:true}
        );
        res.status(200).json(updateUser);

    } catch (error) {
        console.log("Error in profilePic",error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth Controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};