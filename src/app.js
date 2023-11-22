require("dotenv").config();
const express = require('express');
const app = express();
require("./db/conn")

const userRoute = require("./routers/userRoutes");


// Middleware to parse JSON in the request body
app.use(express.json());

// Use the user route
app.use('/api/v1/users', userRoute);

const PORT  = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
