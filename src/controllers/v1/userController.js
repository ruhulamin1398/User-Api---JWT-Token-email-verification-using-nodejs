const asyncHandler = require("express-async-handler")
const User = require("../../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const verificationCode = require("../../models/verificationCodeModel")


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
    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error("User Already Registered");
    }


    // Hash Password 
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    })
    if (user) {

        const isSentVerifyMail = await sentVerifyMail(user.id)
        const data = {
            type: "user"
        }

        const accessToken = await generateJwtToken(user.username, user.email, user._id, 0, data);

        await User.findByIdAndUpdate(
            user.id,
            { token: accessToken },
            { new: true }
        );

        res.status(201);
        // res.json({
        //     _id: user.id , 
        //     _email: user.email,
        //     username :  user.username
        // })
        res.json({
            "msg": "Account Created Successful. Please verify your Email",
            "token": accessToken,
        })


        // 

    }
    else {
        res.status(400)
        throw new Error("user data is not valid ")
    }

}
)


//@des login user 
//@route POST /api/v1/users/login
//@access public 

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400)
        throw new Error("All field are mendatory")
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {

        let accessToken = user.token;
        if (!accessToken) {
            const data = {
                type: "user"
            }
            accessToken = await generateJwtToken(user.username, user.email, user._id, 0, data)
            await User.findByIdAndUpdate(
                user.id,
                { token: accessToken },
                { new: true }
            );

            if (!accessToken) {
                res.status(500);
                throw new Error("Some things went worong , Please try again")
            }


        }

        res.status(200)
        res.json({

            "msg": "login Successfull",
            "token": accessToken,
        })

    }
    else {
        res.status(401);
        throw new Error("Email or Password is wrong ");
    }

})


//@des login udate token 
//@route POST /api/v1/users/update-user-token
//@access public 

const updateUserToken = asyncHandler(async (req, res) => {
    const { email } = req.user;
   
    const user = await User.findOne({ email });
  

    
        if (user) {
            const data = {
                type: "user"
            }
            accessToken = await generateJwtToken(user.username, user.email, user._id, 0, data)
            await User.findByIdAndUpdate(
                user.id,
                { token: accessToken },
                { new: true }
            );

            if (!accessToken) {
                res.status(500);
                throw new Error("Some things went worong , Please try again")
            }


        }

        res.status(200)
        res.json({

            "msg": "Token update Successful",
            "token": accessToken,
        })

 
  

})





//@des current user 
//@route POST /api/v1/users/currentuser
//@access public 

const currentUser = asyncHandler(async (req, res) => {
    res.status(200)
    console.log("status ")
    res.json(req.user)

})


//@des send-verification-email
//@route POST /api/v1/users/send-verification-email
//@access Protected  

const sendVerificationOTP = asyncHandler(async (req, res) => {
    console.log("req ", req.user.id)
    res.status(200)
    const isSentVerifyMail = await sentVerifyMail(req.user.id)
    res.json({
        "msg": "Verification email send successful"
    })

})

//@des send-verification-email
//@route POST /api/v1/users/send-verification-email
//@access Protected  

const validateUserOTP = asyncHandler(async (req, res) => {

    const code = req.query.code
    let BearerToken = req.headers.Authorization || req.headers.authorization || req.query.token
    if (BearerToken && BearerToken.startsWith("Bearer")) {
        token = BearerToken.split(" ")[1];
    }






    res.status(200)

    res.json({
        "msg": "Verification email send successful",
        "user": req.user,
    })

})




// // verify Account via code 
// const verifyEmail = asyncHandler(async (req,res){
//     res.json({
//         "message" : "hello"
//     })

// })



// // send verify email 



const sentVerifyMail = asyncHandler(async (user_id) => {

    console.log("hello i'm here ")
    const user = await User.findById(user_id)
    console.log(user)
    const code = Math.floor(1000 + Math.random() * 9000)
    const verficationCode = await verificationCode.create({
        user_id: user.id,
        verification_code: code,
    })
    const data = {
        verification_code_id: verficationCode.id,
        code: code,
        type: "otp"

    }
    const accessToken = await generateJwtToken(user.username, user.email, user._id, 3600, data)
    console.log(accessToken)


    const emailBodyHtml = `
    <h1>Verification Email</h1>
    <p>Click the button below to verify your account:</p>
    <a style="display: inline-block; background-color: blue; color: white; padding: 10px; border: 1px solid;" href="${process.env.HOST}/verify?id=${user_id}&&token=Bearer ${accessToken}&&code=${code}">Verify Now</a>

    <p>Alternatively, you can copy and paste the following link into your browser:</p>
    
`;




    await sentEMail({
        "body": emailBodyHtml,
        "to": user.email,
        "subject": "Verification Email",

    })


})


const sentEMail = asyncHandler(async (data) => {
    console.log("data :  ", data)



    const tranporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,

        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        }
    })
    console.log(tranporter)



    const mailOptions = {
        from: process.env.SMTP_USER,
        to: data.to,
        subject: data.subject,
        html: data.body
    }
    tranporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("email has been send", info.response)
        }
    })





})







const generateJwtToken = asyncHandler(async (_username, _email, _id, time, data) => {
    const jwtToken = jwt.sign({
        user: {
            username: _username,
            email: _email,
            id: _id,
            type: data.type,
            data,
        },
    },
        process.env.ACCESS_TOKEN_SECRT,
        {
            expiresIn: time !== 0 ? time : 60 * 60 * 24 * 30 * 12,
        },


    )


    console.log(jwtToken)
    return jwtToken;

})







module.exports = { registerUser, loginUser, currentUser, sendVerificationOTP, validateUserOTP,updateUserToken };