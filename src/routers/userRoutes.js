const express = require("express");
const router = express.Router();
const {registerUser} = require("../controllers/userController")





router.post("/register",registerUser)

router.post("/login", (req,res)=>{
    res.json({
        message:"login  the user ",
    })
})
router.post("/current", (req,res)=>{
    res.json({
        message:"Current ",
    })
})

module.exports = router;