const express  = require('express')
const {adminAuth,userAuth} = require("./middlewares/auth")
const app = express()

app.use("/admin",adminAuth)

app.get("/user/login",(req,res)=>{
    console.log("user logged in")
    res.send("login")
})

app.use("/user",userAuth)

app.get("/admin/getAllData",adminAuth,(req,res)=>{
    console.log("sending user data")
    res.send("All data sent")
})



app.listen(3000,()=>{
    console.log("Server is successfully listening at port 3000")
})

