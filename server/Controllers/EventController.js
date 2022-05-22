const Event = require("./../Models/EventModel");
const {validationResult} = require("express-validator")
module.exports.getAllEvents = (request, response, next) => {
  Event.find({})
    .populate({ path: "mainSpeaker" })
    .populate({ path: "otherSpeakers" })
    .populate({ path: "students" })
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

module.exports.getEventForStud = (request, response, next) => {
  let p = request.params.id;
  Event.find()
    .populate({
      path: "students",
      match: { _id: p },
    })

    .then((data) => {
      let d = [];

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].students.length; j++) {
          if (data[i].students[j]._id == p) {
            d.push(data[i]);
          } 
        }
      }
      if (d.length == 0) {
        return response.status(200).json({ message: "no events registered" });
      } else {
        return response.status(200).json({ d });
      }
    })
    .catch((error) => next(error));
};

module.exports.getEventFormainSpeaker = (request, response, next) => {
    let p = request.params.idd;
    Event.find()
      .populate({
        path: "mainSpeaker",
        match: { _id: p },
      })
  
      .then((data) => {

        let d = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].mainSpeaker!=null) {
               d.push(data[i]);
            } 

        }
        if (d.length == 0) {
            return response.status(200).json({ message: "no events registered" });
          } else {
            return response.status(200).json({ d });
          }
      })
      .catch((error) => next(error));
};

module.exports.getEventForSpeaker = (request, response, next) => {
  let p = request.params.idd;
  console.log(request.params.idd);
  Event.find()
    .populate({
      path: "otherSpeakers",
      match: { _id: p },
    })

    .then((data) => {
      let d = [];

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].otherSpeakers.length; j++) {
          console.log("data[i].otherSpeakers[j]");

          console.log(data[i].otherSpeakers[j]);
          if (data[i].otherSpeakers[j]._id == p) {
            d.push(data[i]);
          } 
        }
      }
      if (d.length == 0) {
        return response.status(200).json({ message: "no events registered" });
      } else {
        return response.status(200).json({ d });
      }
    })
    .catch((error) => next(error));
};

module.exports.createEvent = (request, response, next) => {
  let result = validationResult(request);

  if(!result.isEmpty()){
      let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
      let error = new Error(message);
      error.status=422;
      throw error;
  }
  if (request.role == "admin") {
    let event = new Event({
      _id: request.body.id,
      title: request.body.title,
      eventDate: request.body.eventDate,
      mainSpeaker: request.body.mainSpeaker,
      otherSpeakers: request.body.otherSpeakers,
      students: request.body.students,
    });
    for (let i = 0; i < event.otherSpeakers.length; i++) {
      if(event.otherSpeakers[i].toString() === event.mainSpeaker.toString())
      {
          throw new Error("Invalid - main Speaker exists in other speakers")
      }
  }
    event.save()
      .then(() => {
        response.status(200).json({ message: "event created" });
      })
      .catch((error) => next(error));
  }
};

module.exports.updateEvent = (request, response, next) => {
  //connection DB
  if (request.role != "admin") {
    
    throw new Error("Not Authorized"); //middleware will catch it, this will stop the execution
  }

  Event.updateOne(
    { _id: request.body.id },
    {
      $set: {
        _id: request.body.id,
        title: request.body.title,
        eventDate: request.body.eventDate,
        mainSpeaker: request.body.mainSpeaker,
        otherSpeakers: request.body.otherSpeakers,
        students: request.body.students,
      },
    }
  )
    .then((data) => {
      if (data.matchedCount == 0) throw new Error("Event doesn't exist");
      response.status(200).json({ message: "Event updated", data });
    })
    .catch((error) => next(error));
};

module.exports.deleteEvent = (request, response, next) => {
  //connection DB
  if (request.role != "admin" && request.role != "speaker") {
  
    throw new Error("Not Authorized"); //middleware will catch it, this will stop the execution
  }
  Event.deleteOne({ _id: request.body.id })
    .then((data) => {
      if (data.deletedCount == 0) throw new Error("Event doesn't exist");
      response.status(200).json({ message: "Event deleted", data });
    })
    .catch((error) => next(error));
};
