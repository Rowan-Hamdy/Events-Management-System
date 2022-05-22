const express= require("express");
const {body,param,query} = require ("express-validator"); 
const authMiddleware = require("../Middlewares/authMiddleware");
const router = express.Router();
const controller = require("./../Controllers/SpeakerController");

router.use(authMiddleware);




router.route("/speakers")
.get(controller.getAllSpeakers)
.post(
    [
       body("UserName").isAlpha().withMessage("name should be string")
       .isLength({max:10}).withMessage("Username length <10"),
       body("Email").isEmail().withMessage("Email format not valid")

    ]
    
    ,controller.addSpeakers)
.put(controller.updateSpeakers)
.delete(controller.deleteSpeakers)

module.exports=router;