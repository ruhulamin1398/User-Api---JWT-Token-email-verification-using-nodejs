const asyncHandler = require("express-async-handler")


//@desc Register a user 
//@route POST /api/v1/users/register
//@access public 
const registerUser = asyncHandler(async  (req,res)=>{
    res.json({


        message:"Register the user 2 ",
    })
}
)


module.exports = {registerUser};