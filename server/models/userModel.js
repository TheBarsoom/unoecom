const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const { generateHash, compareHash } = require("../modules/bcrypt");
const crypto =require("crypto")
const bcrypt =require("bcrypt")
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    address: [{ type:mongoose.Schema.Types.ObjectId, ref: "Address" }],
    refreshToken:{
      type:String
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
  },
  { timestamps: true }
);

userSchema.pre(`save`,async function (next){
  // if(!this.isModified("password")){
  //   next()
  // }
    this.password = await generateHash(this.password)
})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  // return await compareHash(enteredPassword, this.password);
  return await bcrypt.compare(enteredPassword,this.password)
};

// userSchema.methods.createPasswordResetToken=async function(){
//   const resettoken=crypto.randomBytes(32).toString("hex");

//   this.passwordResetToken=crypto.createHash(`sha256`).update(resettoken).digest("hex");
//   this.passwordResetExpires=Date.now()+30*60*1000
// }
module.exports = mongoose.model("User", userSchema);
