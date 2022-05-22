const express=require("express");
const {body,param,query} = require ("express-validator"); 
const router=express.Router();
const controller=require("./../Controllers/EventController")
const Event= require("./../Models/EventModel");
const authMiddleware = require("../Middlewares/authMiddleware");


router.use(authMiddleware);

router.route("/events")
.get(controller.getAllEvents)
.post(    [
    body("id").isInt().withMessage("id should be integer"),
    body("title").isAlpha().withMessage("title should be string"),
    body("eventDate").isDate().withMessage("Date format should be yyyy/mm/dd")

 ],controller.createEvent)
 .put(controller.updateEvent)
 .delete(controller.deleteEvent)

 router.get ("/events/:id",controller.getEventForStud )
 router.get ("/events/mainspeaker/:idd",controller.getEventFormainSpeaker )
 router.get ("/events/speaker/:idd",controller.getEventForSpeaker )

 
 


module.exports=router;