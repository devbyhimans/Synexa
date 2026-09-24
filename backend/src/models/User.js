import mongoose from "mongoose"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName : {
    type : String,
    required : true,
  },
  email : {
    type : String,
    required : true,
    unique : true,
  },
  password : {
    type : String,
    required : true,
    minlength : 6
  },
  bio : {
    type : String,
    default : ""
  },
  profilePic : {
    type : String,
    default : ""
  },
  nativeLanguage : {
    type : String,
    default : ""
  },
  learningLanguage : {
    type : String,
    default : ""
  },
  location : {
    type : String,
    default : ""
  },
  isOnboarded : {
    type : Boolean,
    default : false
  },
  friends : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  ]
}, {timestamps: true});

// pre-hook(hashing the password by adding a salt to it)

userSchema.pre("save", async function(next) {   // Before a user document is saved to MongoDB, run this function first.

  if(!this.isModified("password")) return next(); //If password was not modified, skip hashing.

  try
  {
    const salt = await bcrypt.genSalt(10);  // Creates a random string to make hashing more secure.
    this.password = await bcrypt.hash(this.password, salt);  //Converts the real password into a secure hashed value.
    next(); // Tells mongoose to continue saving the document.
  }
  catch(err)
  {
    next(err);
  }
})

userSchema.methods.matchPassword =  async function(enteredPassword)
{
  const isCorrectPassword = await bcrypt.compare(enteredPassword, this.password);
  return isCorrectPassword;
}

// Create the model after the pre-hook so that pre-hook work properly
const User = mongoose.model("User", userSchema);

export default User;