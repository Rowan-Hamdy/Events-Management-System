const { default: ObjectID } = require("bson-objectid");
const mongoose = require ("mongoose");

//1- create schema
let eventSchema = mongoose.Schema({
    _id : Number,
    title:{type: String, required: true},
    eventDate:{type:Date},
    mainSpeaker: {type:mongoose.Schema.Types.ObjectId, ref:"speakers"} ,
    otherSpeakers:[{type:mongoose.Schema.Types.ObjectId, ref:"speakers"}],
    students:{type:Array, ref:"students"}
});


//2-register //collection  //schema
module.exports = mongoose.model("events",eventSchema)
