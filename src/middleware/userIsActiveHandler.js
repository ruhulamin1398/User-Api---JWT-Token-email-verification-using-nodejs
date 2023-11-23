const asyncHandler = require("express-async-handler"); 
const User = require("../models/userModel")

const checkUserIsActive = asyncHandler(async (req, res, next) => { 
    const { email, password} = req.body;
    
    
      const user = await User.findById(decoded.user._id);
      if (!user  ) {
      
        res.status(401);
        throw new Error("Email or Password is wrong ");

      }
      else if( !user.isActive){
        res.status(403);
        throw new Error("User is not active");
      }
      else{
        next();
      }

 

 
});

module.exports = checkUserIsActive;
