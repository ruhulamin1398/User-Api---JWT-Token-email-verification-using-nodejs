const express = require("express");
 require("./db/conn")
 


const app = express();
const port = process.env.PORT || 3000;


app.use("/api/v1/users", require("./routers/userRoutes"))





app.listen(port, ()=>{
    console.log(`connected in port no. ${port}`)
})