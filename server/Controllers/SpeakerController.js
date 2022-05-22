const {validationResult} = require("express-validator")
const Speaker = require("./../Models/speakerModel");
const mongoose = require ("mongoose");
const req = require("express/lib/request");

module.exports.getAllSpeakers = (request, response, next)=> {
    //connection DB
    // console.log(request.params);
    Speaker.find({})
            .then((data)=> {
              response.status(200).json(data);

            })
            .catch(error => {
                next(error);
            })
}

module.exports.getSpeaker= (request, response)=> {
    //connection DB
   
    response.status(200).json({message:"Speaker by ID"})
}

module.exports.addSpeakers = (request, response, next)=> {
    let result = validationResult(request);

    if(!result.isEmpty()){
        let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
        let error = new Error(message);
        error.status=422;
        throw error;
    }
    if(request.role == "admin"){

    
    //connection DB
    let result = validationResult(request); //hal el data feha ayerrors walla la2
    if(!result.isEmpty()){
        let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
        let error = new Error(message);
        error.status=422;
        throw error;
    }

    let speaker = new Speaker({
        _id:new mongoose.Types.ObjectId(),
        UserName: request.body.UserName,
        Email: request.body.Email,
        password: request.body.password,
        city:  request.body.city,
        street:  request.body.street,
        building:  request.body.building
    });

    speaker.save()
    .then((data)=>{
    console.log(request.body);

        response.status(201).json({message:"Speaker Added",data})

    })
    .catch(error => next(error))
 }

}

module.exports.updateSpeakers = (request, response,next)=> {
    //connection DB
    if(request.role != "admin" && request.role != "speaker"){
       // next( new Error ("Not Authorized")); //3'alat hena hay3ml crash ll server
       throw new Error ("Not Authorized"); //middleware will catch it, this will stop the execution
    }
    if(request.role=="speaker"){
        Speaker.updateOne({_id:request.body.id},{
            $set:{
            UserName: request.body.UserName,
            Email: request.body.Email,
            password: bcrypt.hashSync(request.body.password, 10),
            city:  request.body.city,
            street:  request.body.street,
            building:  request.body.building
            }
        }).then(data=>{
            if(data.matchedCount == 0)
            throw new Error("Speaker doesn't exist");
            response.status(200).json({message:"Speaker updated",data});
    
        }).catch(error =>next(error))
    }
    else if(request.role=="admin") {
        Speaker.updateOne({_id:request.body.id},{
            $set:{
            Email: request.body.Email,
            city:  request.body.city,
            street:  request.body.street,
            building:  request.body.building
            }
        }).then(data=>{
            if(data.matchedCount == 0)
            throw new Error("Speaker doesn't exist");
            response.status(200).json({message:"Speaker updated",data});
    
        }).catch(error =>next(error))
    }

//========================Another way to update=============================//
    // Department.findById(request.body.id)
    // .then(data=>{
    //     if(data!=null)
    //     throw new Error("Department not exists");
    //     data.name = request.body.name;
    //     return data.save()
        

    // }).then(data =>{
    //     response.status(200).json({message:"Department updated",data});

    // }).catch(error =>next(error))

}
module.exports.deleteSpeakers = (request, response,next)=> {
    //connection DB
    if(request.role != "admin"){
        // next( new Error ("Not Authorized")); //3'alat hena hay3ml crash ll server
        throw new Error ("Not Authorized"); //middleware will catch it, this will stop the execution
     }
     Speaker.deleteOne({Email: request.body.Email})
     .then(data =>{ 
         if(data.deletedCount == 0)
        throw new Error("Speaker doesn't exist");
        response.status(200).json({message:"Speaker deleted",data})
    })
     .catch(error =>next(error))
   

}