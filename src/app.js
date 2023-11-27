require("dotenv").config();
const express = require('express');
const app = express();
require("./db/conn")
const errorHandler = require("./middleware/v1/errorHandler");


// const listEndpoints = require('express-list-endpoints');




const userRoute = require("./routers/v1/userRoutes");
const contactRoutes = require("./routers/v1/contactRoutes"); 
const AsyncHandler = require("express-async-handler");
const User = require("./models/userModel");


// Middleware to parse JSON in the request body
app.use(express.json());

app.get('/hi', AsyncHandler(async(req,res)=>{
  // Update all existing documents to include the new fields
 await User.updateMany({}, { $set: { is_verified: false, verification_code: 0 } });
 res.json({ "msg" : "done"})

}));
// for no production only , please remove before deploy
app.get('/clean-data', AsyncHandler(async(req,res)=>{
   
  
  const prevUser = await User.find({});
  await User.deleteMany({});
  const users = await User.find({});
 res.json({ "msg" : "All users was deleted ", "users": users })

}));

  

// Use the user routecontra
app.use('/api/v1/users', userRoute);

app.use('/api/v1/contacts', contactRoutes);


// console.log(listEndpoints(app));



app.use(errorHandler);
const PORT  = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
