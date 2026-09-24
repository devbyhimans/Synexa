import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

// random avatar selection ke liye jugad
const avatars = [   // sare avatars li list jo assets/Avatars me hai
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
  "avatar8.png",
  "avatar9.png",
  "avatar10.png",
  "avatar11.png",
  "avatar12.png"
];

const getRandomAvatar = () => {   // random avatar selection using the random index number 
  return avatars[Math.floor(Math.random() * avatars.length)];
};


export async function signup (req,res) {
  const {fullName, email, password} = req.body;
  
  try 
  {
    if(!email ||  !fullName || !password){
      return res.status(400).json({message: "All fields are required"});  //This line returns an HTTP 400 error response with a JSON message telling the client that required fields are missing.
    }

    if(password.length < 6){
      return res.status(400).json({message: "Password must be atleast 6 character long"}); 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test whether the email is in the correct format or not
    if(!emailRegex.test(email)) {
      return res.status(400).json({message: "Invalid email format"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "Email is already exists, please use a different one"});
    }

    // random avatar select (from the assets folder)
    //const randomAvatar = getRandomAvatar();
    //const avatarUrl = `${process.env.BASE_URL || "http://localhost:5001"}/avatars/${randomAvatar}`;


    // create the random avatar using the URL by changing the seed value only 
    const idx = Math.floor(Math.random() * 200) + 1; // 1-200 included
    const avatarUrl =`https://api.dicebear.com/7.x/adventurer/svg?seed=${idx}`;

    // create the new user and save it in the database
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic : avatarUrl, 
    })

    // store the user data into the stream as well
    try {
      await upsertStreamUser({
        id : newUser._id.toString(),
        name : newUser.fullName,
        image : newUser.profilePic || ""
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    }
    catch(error){
      console.error("Error creating the stream user", error)
    }

    // create the jwt token
    const token = jwt.sign(
      {userId:newUser._id},         // payload -> what is stored in the token
      process.env.JWT_SECRET_KEY,   // secret key-> to protect the token
      {expiresIn: "7d"}             // option -> after that much time the user has to signin again
    );

    // create the cookie 
    res.cookie("jwt", token, {
      maxAge : 7*24*60*60*1000, 
      httpOnly: true,    // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production"
    });

    res.status(201).json({success:true, user:newUser});
  }
  catch(err)
  {
    console.log("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login (req,res){
  
  try
  {
    const {email, password} = req.body;

    // check the email or password is provided by the user
    if(!email || !password){
      return res.status(400).json({message:"All fields are required"})
    }
    
    // checking is there any user regiestered in the db with this email
    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({message:"Invalid email or password"});
    }

    // checking the password is correct or not
    const isPasswordCorrect = await user.matchPassword(password);
    if(!isPasswordCorrect){
      return res.status(401).json({message:"Invalid email or password"});
    }

    // now if the password is correct -> create the token store it in the cookie
    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"7d"});

    res.cookie("jwt", token, {
      maxAge: 7*24*60*60*1000,
      httpOnly: true,
      sameSite:"strict",
      secure:process.env.NODE_ENV === "production"
    });

    res.status(200).json({success:true, user});
  }
  catch(err)
  {
    console.log("Error is in the login controller", err.message);
    res.status(500).json({message:"Internal server error"});
  }
}

export function logout (req,res){

  // for the logout we only have to delete the cookies 
  res.clearCookie("jwt"); // we store the cookie by name "jwt" so delete by its name
  res.status(200).json({success:true, message:"Logout Successfull"});
}

export async function onboard (req, res){

  try{

    // we can access the user from req because we stored it in the protectRoute middleware
    const userId = req.user._id;

    const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(401).json({
          message:"All fields are requireddd",
          missingFields : [
            !fullName && "fullName",
            !bio && "bio",
            !nativeLanguage && "nativeLanguage",
            !learningLanguage && "learningLanguage",
            !location && "location",
          ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body, 
        isOnboarded:true
      },
      {  new: true  }
    );

    if(!updatedUser){
      return res.status(404).json({message:"User not found"})
    }
    
    // update the user info in the stream also
    try{
      await upsertStreamUser({
        id : updatedUser._id.toString(),
        name : updatedUser.fullName,
        image : updatedUser.profilePic || "",
      })
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    }
    catch(streamError){
      console.error("Error while updating stream user during onboarding", streamError.message);
    }
    
    // console.log(req.body)
    // console.log(updatedUser);
    res.status(200).json({success:true, user:updatedUser});
  }
  catch(error){
    console.error("Onboarding error ", error);
    res.status(500).json({message:"Internal server error"});
  }
}