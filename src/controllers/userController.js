const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")


//@desc Register a user 
//@route POST /api/v1/users/register
//@access public 
const registerUser = asyncHandler(async (req, res) => {

    // console.log(req.body)
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});

    if(userAvailable)
    { 
        res.status(400);
        throw new Error("User Already Registered");
    }
     
    
    // Hash Password 
    const hashedPassword = await bcrypt.hash(password,10)
    console.log("hashed Password is ", password, " - ", hashedPassword)


    const user = await User.create({
        username, 
        email, 
        password : hashedPassword,
    })
    if(user){
        res.status(201);
        res.json({
            _id: user.id , 
            _email: user.email,
            username :  user.username
        })
    }
    else {
        res.status(400)
        throw new Error ("user data is not valid ")
    }



 
}
)


module.exports = { registerUser };