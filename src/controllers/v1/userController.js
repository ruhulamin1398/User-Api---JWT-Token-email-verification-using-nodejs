const asyncHandler = require("express-async-handler")
const User = require("../../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const verificationCode = require("../../models/verificationCodeModel")
const { sentEMail } = require("./mailSenderController")


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

    try {

        const email = req.user.email;
        const user = await User.findOne({ email });


        const id = user._id;
        const username = user.username;
        const is_verified = user.is_verified


        res.status(200)


        res.json({
            id,
            username,
            email,
            is_verified
        })

    }
    catch (err) {
        res.status(401);
        throw new Error(err);
    }


})


//@des resend-verification-email
//@route POST /api/v1/users/resend-verification-email
//@access Protected  

const reSendVerificationOTP = asyncHandler(async (req, res) => {
    console.log("req ", req.user.id)
    res.status(200)
    const isSentVerifyMail = await sentVerifyMail(req.user.id)
    res.json({
        "msg": "Verification email send successful"
    })

})

//@des verify-user-otp-token
//@route POST /api/v1/users/verify-user-otp-token
//@access Protected  

const verifyUserOtpToken = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    // console.log("user id ", user_id)

    let user = {}
    try {
        user = await User.findById(user_id)
        if (user.is_verified) {

            res.status(200)

            res.json({
                "msg": "User Already Activated",

            })

        }
    }
    catch (err) {
        res.status(500);
        throw new Error(err)

    }


    // console.log("user id ", user_id)
    const verficationData = await verificationCode.findOne({ user_id }).sort({ createdAt: -1 }).limit(1);

    let BearerToken = req.query.token.split(" ")[1]
    let status= 0;
    // res.status(200)
    // res.json({BearerToken, verficationData})
    if (BearerToken && BearerToken ==  verficationData.token) {
        status = 1;
    } else if (verficationData.verification_code == req.body.code) {
        status = 1;
    }
 

    if(status){
        try{
            await User.findByIdAndUpdate(
                user.id,
                { is_verified: true },
                { new: true }
            );
            res.status(200);
            res.json({
                "msg": "User is Activated",

            })
            
        }catch(err){ 
            res.status(500);
            throw new Error("Some things went worong , Please try again2")
        }
       

    }
    else{ 
        res.status(500);
        throw new Error("Some things went worong , Please try again3")

    }


    





})




// // verify Account via code 
// const verifyEmail = asyncHandler(async (req,res){
//     res.json({
//         "message" : "hello"
//     })

// })



// // send verify email 



const sentVerifyMail = asyncHandler(async (user_id) => {

    // console.log("hello i'm here ")
    const user = await User.findById(user_id)
    // console.log(user)
    const code = Math.floor(1000 + Math.random() * 9000)

    const data = {
        verification_code_id: verficationCode.id,
        code: code,
        type: "otp"

    }
    const accessToken = await generateJwtToken(user.username, user.email, user._id, 3600, data)
    // console.log(accessToken)

    const verficationCode = await verificationCode.create({
        user_id: user.id,
        verification_code: code,
        token: accessToken
    })




    const emailBodyHtml = `
    <H1>Verification code : ${code}</H1>
    <p>Click the button below to verify your account:</p>
    <a target="_blank" style="display: inline-block; background-color: blue; color: white; padding: 10px; border: 1px solid;" href="${process.env.HOST}/users/verify-user-otp-token?id=${user_id}&&token=Bearer ${accessToken}">Verify Now</a>

    <p>Alternatively, you can copy and paste the following link into your browser:</p>
    <pre>${process.env.HOST}/users/verify-user-otp-token?id=${user_id}&&token=Bearer ${accessToken} </pre>
    
`;



    try {
        await sentEMail({
            "body": emailBodyHtml,
            "to": user.email,
            "subject": "Verification Email",

        })
    }
    catch (err) {
        console.log(err)
    }



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







module.exports = { registerUser, loginUser, currentUser, reSendVerificationOTP, verifyUserOtpToken, updateUserToken };