const mongoose = require ("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require ('bcryptjs');

//1- create schema
let studentSchema = mongoose.Schema({
    _id : Number,
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true} //bcrypt
    // department: {type:Number, ref:"departments"} // will refer to the pkey of departments
});
studentSchema.plugin(uniqueValidator)
studentSchema.pre('save',async function(next){
   if(!this.isModified('password')){
      next();
   }
   this.password = await bcrypt.hash(this.password,10);
})
//2-register //collection  //schema
module.exports = mongoose.model("students",studentSchema)

