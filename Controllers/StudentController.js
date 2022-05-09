
const Student = require("./../Models/studentModel"); 
const {validationResult} = require("express-validator")
const bcrypt = require ('bcryptjs');

module.exports.getAllStudents = (request, response, next )=> {
    Student.find({}) 
            .then(data=> {
                response.status(200).json({data})
            })
            .catch(error => next(error) )

}

module.exports.createStudent = (request, response, next )=> {
    let result = validationResult(request);

    if(!result.isEmpty()){
        let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
        let error = new Error(message);
        error.status=422;
        throw error;
    }
    if(request.role == "admin"){

    let student = new Student({
        _id: request.body.id,
        email: request.body.email,
        password: request.body.password,

    })
    student.save()
    .then(()=>{
        response.status(200).json({message: "Student Created"})

    })
    .catch(error => next(error))
  }
}

module.exports.updateStudents = (request, response,next)=> {
    //connection DB
    if(request.role != "admin" && request.role != "student"){

       throw new Error ("Not Authorized"); //middleware will catch it, this will stop the execution
    }
    if(request.role=="student"){
        Student.updateOne({_id:request.body.id},{
            $set:{
        
            email: request.body.email,
            password: bcrypt.hashSync(request.body.password, 10),

            }
        }).then(data=>{
            if(data.matchedCount == 0)
            throw new Error("Student doesn't exist");
            response.status(200).json({message:"Student updated",data});
    
        }).catch(error =>next(error))
    }
    else if(request.role=="admin") {
        Student.updateOne({_id:request.body.id},{
            $set:{
            email: request.body.email,
            }
        }).then(data=>{
            if(data.matchedCount == 0)
            throw new Error("Student doesn't exist");
            response.status(200).json({message:"Student updated",data});
    
        }).catch(error =>next(error))
    }
}


module.exports.deleteStudent = (request, response,next)=> {
    //connection DB
    if(request.role != "admin"){

        throw new Error ("Not Authorized"); //middleware will catch it, this will stop the execution
     }
     Student.deleteOne({email: request.body.email})
     .then(data =>{ 
         if(data.deletedCount == 0)
        throw new Error("Student doesn't exist");
        response.status(200).json({message:"Student deleted",data})
    })
     .catch(error =>next(error))
   

}


