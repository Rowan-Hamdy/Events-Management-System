const mongoose = require ("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require ('bcryptjs');
//1- create schema
let speakerSchema = mongoose.Schema({
    _id :mongoose.Schema.Types.ObjectId,
    Email:{
        type: String, 
        required: true, 
        unique: true
     },
     UserName:{
        type: String, 
        required: true, 
        unique: true
     },
     password:{
        type: String, 
        required: true, 
     },
     city: {
        type: String
      }, 
     street:{
        type:String
      }, 
     building: {
        type: Number
      }
    

});

speakerSchema.plugin(uniqueValidator)
speakerSchema.pre('save',async function(next){
   if(!this.isModified('password')){
      next();
   }
   this.password = await bcrypt.hash(this.password,10);
})
// speakerSchema.methods.hashPassword = (password) => {
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// }
//2-register //collection  //schema
module.exports = mongoose.model("speakers",speakerSchema)
