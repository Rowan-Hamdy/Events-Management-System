

const express= require("express");
const {body,param,query} = require ("express-validator"); 
const router = express.Router();
const controller = require("./../Controllers/authController")
router.post("/register",controller.registration);
router.post("/login",controller.login);


module.exports = router;