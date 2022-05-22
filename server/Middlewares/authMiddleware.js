
const jwt =  require('jsonwebtoken');

module.exports= (request,response,next)=>{
    let token,decodedToken;
    try {
    
        token = request.get("Authorization").split("\"")[1];
        decodedToken = jwt.verify(token,"secretKey");
        console.log(decodedToken);
  
    }
    catch(error){
        next(new Error("Not Authenticated"));

    }

    //ok you are authenticated 
    request.role = decodedToken.role;
    next();

}