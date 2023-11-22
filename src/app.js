require("dotenv").config();
const express = require('express');
const app = express();
require("./db/conn")
const errorHandler = require("./middleware/errorHandler");


// const listEndpoints = require('express-list-endpoints');




const userRoute = require("./routers/userRoutes");
const contactRoutes = require("./routers/contactRoutes");


// Middleware to parse JSON in the request body
app.use(express.json());

// Use the user routecontra
app.use('/api/v1/users', userRoute);

app.use('/api/v1/contacts', contactRoutes);


// console.log(listEndpoints(app));



app.use(errorHandler);
const PORT  = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
