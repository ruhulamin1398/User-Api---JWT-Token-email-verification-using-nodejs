const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")


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
       const isSendMail=  await sentVerifyMail(user.username, user.email, user._id )
    }
    else {
        res.status(400)
        throw new Error ("user data is not valid ")
    }

 res.json({
    message : "Register user"
 })
}
)


//@des login user 
//@route POST /api/v1/users/login
//@access public 

const loginUser= asyncHandler( async(req,res) =>{
    const { email, password} = req.body;
    if( !email || !password){
        res.status(400)
        throw new Error("All field are mendatory")
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id
            },  
        },
        process.env.ACCESS_TOKEN_SECRT,
        {expiresIn : "1000m"},
        )
        res.status(200)
        res.json({accessToken})
    }

})


//@des login user 
//@route POST /api/v1/users/login
//@access public 

const currentUser= asyncHandler( async(req,res) =>{
    res.status(200)
    console.log("status ")
    res.json(req.user)

})


// verify Account via code 
const verifyEmail = asyncHandler(async (req,res){
    res.json({
        "message" : "hello"
    })
    ///
})

// send verify email 
const sentVerifyMail = asyncHandler(async (name , email, user_id) => {
   const tranporter =  nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASSWORD
        }
    })
    console.log(tranporter)
    const emailBodyHtml = `
    <h1> Verification Email</h1>
    <p>  click here to verfy     </p><br>
    <a href="${process.env.HOST}/verify?id=${user_id}"> Click here </a>
    `
 0 

    const mailOptions={
        from : process.env.SMTP_USER,
        to:email,
        subject: "Verification Email",
        html:emailBodyHtml
    }
    tranporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log(err)
        }
        else{
            console.log("email has been send", info.response )
        }
    })
})












module.exports = { registerUser,loginUser,currentUser };