//server
const express = require("express");
const body_parser= require("body-parser");
const mongoose = require("mongoose");

const authRouter = require("./Routers/authRouter");
const studentRouter = require("./Routers/StudentsRouters");
const speakerRouter = require("./Routers/SpeakerRouter");
const eventRouter = require("./Routers/EventRouter");



//1- create server 
const server = express();
mongoose.connect("mongodb://localhost:27017/Event_System")
.then(()=>{
   console.log(" DB Connected");
   //2-listen to a port number
   server.listen(process.env.PORT||8080,()=>{
   console.log("Server is listening....")
})
})
.catch(eror => console.log("DB Connection Problem"))


//After creating server, create middlewares and routers

//Middleware for logging 
server.use((request,response, next)=>{
   console.log(request.url, request.method);
    next();
})

//body parsing MW
server.use(body_parser.json())
server.use(body_parser.urlencoded({extended:false}))

//Routes

server.use(authRouter);
server.use(speakerRouter);
server.use(studentRouter);
server.use(eventRouter);


 //Not Found MW
 server.use(( request,response)=>{
   
    response.status(404).json({message:"Page is not found"});

 });


 //Error MW
 server.use((error, request,response,next)=>{
   
    response.status(500).json({message:error+""});

 })
