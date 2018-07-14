var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var request = require("request");

var ObjectID = mongodb.ObjectID;
//var basicAuth = require('basic-auth');
//var authCreds = require("./auth-creds.js");

var nodemailer = require('nodemailer');
var router = express.Router();

var app = express();
app.use(express.static(__dirname + "/public", {
  extensions: ['html','htm']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// var server = app.listen(process.env.PORT || 80, function () {
//   var port = server.address().port;
//   console.log("App now running on port", port);
// });

// app.get("/circles", function(req,res) {
//   res.sendFile(__dirname + "/public/circles.html");
// });
//
// app.get("/permissions", function(req,res) {
//   res.sendFile(__dirname + "/public/permissions.html");
// });
//
// app.get("/disagree", function(req,res) {
//   res.sendFile(__dirname + "/public/permissions.html");
// });

// var auth = function (req, res, next) {
//   function unauthorized(res) {
//     res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//     return res.send(401);
//   };
//
//   var user = basicAuth(req);
//
//   if (!user || !user.name || !user.pass) {
//     return unauthorized(res);
//   };
//
//   if (user.name === authCreds.user && user.pass === authCreds.pass) {
//     return next();
//   } else {
//     return unauthorized(res);
//   };
// };

var PATIENTS_COLLECTION = "patients";


// app.use(cookieParser());
// app.use(session({secret: authCreds.secret}))

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var database;

// Connect to the database before starting the application server.
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
MongoClient.connect('mongodb://heroku_30ntgntk:bvtfa7pk1lniibvcvvb32jjme@ds153980.mlab.com:53980/heroku_30ntgntk', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }

    database = db

    var server = app.listen(process.env.PORT || 80, function () {
    var port = server.address().port;
    console.log("App now running on port", port);

    db.collection("test").find({"test1":"testa"}).toArray(function(err,docs){
      console.log(docs);
    });
  });
});

// API Routes Below

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

//
//
// /*  "/drugs"
//  *    GET: finds all drugs
//  *
//  */
// app.get("/api/v1/drugs", function(req, res){
//   database.collection(DRUGS_COLLECTION).find({}).toArray(function(err, docs) {
// 	if (err) {
// 	    handleError(res, err.message, "Failed to get drugs.");
// 	} else {
// 	    res.status(200).json(docs);
// 	}
//     });
// });
//
// /*  "/drugs"
//  *    POST: save new drug
//  */
// app.post("/drugs", function(req, res) {
//   var newDrug = req.body;
//   console.log(req.body);
//   newDrug.createDate = new Date();
//   newDrug.updateDate = new Date();
//
//   database.collection(DRUGS_COLLECTION).insertOne(newDrug, function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to create new drug.");
//     } else {
//       res.status(201).json(doc.ops[0]);
//     }
//   });
// });
//
// /*  "/drugs"
//  *    PUT: update existing drug
//  */
// app.put("/drugs/:id", function(req, res) {
//   var newDrug = req.body;
//   newDrug.updateDate = new Date();
//
//   // if (!(req.body.firstName || req.body.lastName)) {
//   //   handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
//   // }
//
//   database.collection(DRUGS_COLLECTION).insertOne(newDrug, function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to create new drug.");
//     } else {
//       res.status(201).json(doc.ops[0]);
//     }
//   });
// });
//
// /*  "/drugs/:id"
//  *    GET: find drug by id
//  *
//  *
//  */
// app.get("/api/v1/drugs/:id", function(req, res) {
//   db.collection(DRUGS_COLLECTION).findOne({ "name" : req.params.id }, function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to get drug");
//     } else {
//       res.status(200).json(doc);
//     }
//   });
// });

var patients = [{
  "phn": "9000123456",
  "name": "Edna Gartner",
  "phoneNumber": "(778) 876-5432",
  "address": "123 Evergreen Terrace, Vancouver, BC",
  "dob": "1948-06-01",
  "sex": "Female"
}];

var circleMembers = {
  "inner": [{
    "name": "Susie Skinner",
    "phone": "(604) 604-0406",
    "email": "susie.skinner@geocities.com",
    "relationship": "Daughter"
    }],
  "outer": [{
      "name": "George Simpson",
      "phone": "(604) 222-2222",
      "email": "george.simpson@yahoo.com",
      "relationship": "Neighbour"
    }],
  "extended": [{
      "name": "Barry Chalmers",
      "phone": "(778) 778-7788",
      "email": "barry.chalmers@altavista.com",
      "relationship": "Friend"
  }]
};

var enrolledPatients = [];

app.post("/enroll", function(req,res) {
  enrolledPatients.push(req.body);
});

app.get("/patients", function(req,res) {
  var found = false;
  patients.forEach(patient => {
    if (!found && patient.phn == req.query.phn){
      res.status(200).json(patient);
      found = true;
    }
  });
  if (!found){
    res.status(400).send("Patient not found with this PHN");
  }
});


/*  "/patients"
 *    POST: save new patient
 */
app.post("/patients", function(req, res) {
  var newPatient = req.body;
  console.log(req.body);
  newPatient.createDate = new Date();
  newPatient.updateDate = new Date();

  database.collection(PATIENTS_COLLECTION).insertOne(newPatient, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new patient.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/circlemembers/inner", function(req,res) {
  circleMembers["inner"].push(req.body);
  console.log("POST /circlemembers/inner");
  console.log(req.body);
  res.status(200).send();
});

app.post("/circlemembers/outer", function(req,res) {
  circleMembers["outer"].push(req.body);
  console.log("POST /circlemembers/outer")
  console.log(req.body);
  res.status(200).send();
});

app.post("/circlemembers/extended", function(req,res) {
  circleMembers["extended"].push(req.body);
  console.log("POST /circlemembers/extended")
  console.log(req.body);
  res.status(200).send();
});

app.get("/circlemembers", function(req,res) {
  res.status(200).json(circleMembers);
});

app.post("/update", function(req,res) {
  patients.push(req.body);
});

app.post("/permissions", function(req,res) {
  console.log(req.body);
  res.status(200).send();
});

app.post("/patients/:phn/permissions", function(req,res) {
  database.collection(PATIENTS_COLLECTION).update({phn:req.params.phn}, {$set: {permissions:req.body}}, function(err, doc){
    if (err) {
      handleError(res, err.message, "Failed to update permissions.");
    }
  });

  console.log(req.body);
  res.status(200).send();
});

//
// app.post("/email", function(req, res) {
//   // Contact Form send email using Zoho SMTP Server and NodeMailer
//     var transporter = nodemailer.createTransport({
//         service: 'Zoho',
//         auth: {
//             user: authCreds.smtp.user, // Your email id
//             pass: authCreds.smtp.pass // Your password
//         }
//     });
//
//     var mailOptions = {
//         from: 'info@carecircles.ca',
//         //replyTo: 'info@carecircles.ca',
//         to: req.body.email, // list of receivers
//         subject: 'Care Circles Info', // Subject line
//         text: "Test Email"
//     };
//
//     transporter.sendMail(mailOptions, function(error, info){
//         if(error){
//             // console.log(error);
//             res.status(500).send("There was a problem sending the message. Please send email to info@carecircles.ca");
//         }else{
//             // console.log('Message sent: ' + info.response);
//             res.status(200).send("Message sent successfully, we will reply as soon as possible!");
//         };
//     });
// });


app.post("/sms", function(req,res){
  console.log(req.body.phone);
  console.log(req.body.smspassword);
  console.log(req.body.message)

  var smsPassword = process.env.SMS_PASSWORD; // Our password to secure SMS functionality
  if (req.body.smspassword != smsPassword){
    res.status(401).send("SMS Password is incorrect");
    return;
  }

  var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
  var authToken = process.env.TWILIO_TOKEN;   // Your Auth Token from www.twilio.com/console
  var twilio = require('twilio');
  var client = new twilio(accountSid, authToken);

  client.messages.create({
      body: req.body.message,
      to: req.body.phone,  // Text this number
      from: process.env.TWILIO_PHONE // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

  res.status(200).send();
});


app.post("/contactform", function(req,res) {
  var messageText = '*Name:* ' + req.body.name + '\n' + '*Email:* ' + req.body.email + '\n' + '*Message:* ' + req.body.message

  request.post(process.env.SLACK_CONTACT_FORM_URL,
    { json: { mrkdwn: true, text: messageText } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body)
        } else if (error) {
          console.log(error)
        } else if (!error){
          console.log(body)
        }
    });
    res.status(200).send();
});
