const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { checkToken } = require("../modules/jwt");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith(`Bearer`)) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = await checkToken(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error(`Not Authorized token expired, Please Login again`);
    }
  } else {
    throw new Error(`There is no token attached to header`);
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
    console.log(`isAdminMiddleware`);
    console.log(req.user);
    const {email}=req.user
    try {
        const adminUser= await User.findOne({email:email})
        if(adminUser.role !==`admin`){
            throw new Error(`You are not admin`)
        }else{
            console.log(`Admin Middleware`);
            console.log(adminUser.role);
            next()
        }
    } catch (error) {
        throw new Error(error)
    }

});
module.exports = { authMiddleware,isAdmin };
