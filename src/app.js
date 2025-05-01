const express  = require('express')

const app = express()


app.use("/test",(req,res)=>{
    res.send("Hello from Test")
})

app.use("/",(req,res)=>{
    res.send("Server")
})


app.listen(3000,()=>{
    console.log("Server is successfully listening at port 3000")
})

