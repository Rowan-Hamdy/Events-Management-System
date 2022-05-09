//ay 7aga leha 3laka bel authentication betroo7 ll router
//kol router lazem ykoon loh controller


const express= require("express");
const {body,param,query} = require ("express-validator"); 
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();
const controller = require("./../Controllers/StudentController");

router.use(authMiddleware);



router.route("/students") //el : m3nahom en el id de msh route de query params
.get(controller.getAllStudents)
.post([
    body("id").isInt().withMessage("Id should be Number"),
    body("email").isEmail().withMessage("Email format is not valid")
],
    controller.createStudent)
 .put(controller.updateStudents)
 .delete(controller.deleteStudent)

 

module.exports = router;