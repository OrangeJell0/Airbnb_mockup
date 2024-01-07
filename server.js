const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const formValidation = require("./public/js/formValidation");                   // homemade module
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const salt = '$2a$10$g4z4MQjpCexuZ3PN.UOWAe';

mongoose.connect("mongodb+srv://OrangeJello:rlaxodbs1025@cluster0.xkvvk0b.mongodb.net/", {useNewUrlParser: true, useUnifiedTopology: true});

const HTTP_PORT = process.env.PORT || 8080;

app.use('/js', express.static("./public/js"))
app.use(express.static("./public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));                             // body parser
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));         // set handlebars
app.set('view engine', '.hbs');
app.use(session({ secret: "week10example_web322", cookie: { maxAge: 3000000 }}))  // session middleware, 30 seconds by default

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// set up mongoDB models (users and rooms)
var userSchema = new mongoose.Schema({
    "email": {"type": String, "unique" : true},
    "firstname": {"type" : String, "require" : true},
    "lastname": {"type" : String, "require" : true},
    "password": {"type" : String, "require" : true},
    "month": {"type" : Number, "require" : true},
    "day": { "type" : Number, "require" : true},
    "year": {"type" : Number, "require" : true},
    "type": {"type" : String, "require" : true, "default" : "member"},
    "subscribe" : Number
});
var User = mongoose.model("user", userSchema);

var roomSchema = new mongoose.Schema({
    "number":  {"type": Number, "unique": true},
    "title": {"type": String, "require": true},
    "src": {"type": String, "require": true},
    "description": {"type": String, "require": true},
    "location": {"type": String, "require": true},
    "price": {"type": Number, "require": true}
});
var Room = mongoose.model("room", roomSchema);

var bookSchema = new mongoose.Schema({
    "number": {"type": Number, "unique": true},
    "roomNumber": {"type": Number, "require": true},
    "checkIn": {"type": Number, "require": true},
    "checkOut": {"type": Number, "require": true}, 
    "numOfGuests": {"type": Number, "require": true}
});
var Book = mongoose.model("book", bookSchema);

// register a expression for handlebars
var hbs = exphbs.create({});
hbs.handlebars.registerHelper("isAdmin", function(type) {
    return type == "admin";
});
hbs.handlebars.registerHelper("json", function (content) {
    return JSON.stringify(content);
});

// multer setup
const storage = multer.diskStorage({
    destination: "./public/img/",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});
  
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

//-------------------------------------------------------------------------------------------

// ROUTES
app.get("/", (req, res) => {    
    let renderList = {
        promotion: true,
        searchForm: true,
        information: true
    }
    res.render('layouts/main', {
        data: renderList
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = bcrypt.hashSync(req.body.password, salt);

    // authentication
    User.find({"email": username})
    .exec()
    .then((user) => {
        console.log(user);
        if (user.length) {
            if (user[0].password === password) {
                req.session.user = user[0];
                // redirect user to different dashboard based on their type
                if (req.session.user.type == "member") {
                    res.redirect("/memberDashboard");
                } else {
                    res.redirect("/adminDashboard");
                }
            } else {
                res.render("layouts/main", {data: {loginForm: true, error: true, msg: "The username and password do not match!"}});
            }
        } else {
            res.render("layouts/main", {data: {loginForm: true, error: true, msg: "The username does not exist!"}});
        }        
    })
});

app.get("/login", (req, res) => {
    res.render('layouts/main', {
        data: {loginForm: true}
    });
})

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

app.get("/memberDashboard", ensureLogin, (req, res) => {
    res.render("layouts/main", {user: req.session.user, data: { "renderDash": true }});
})

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      next();
    }
}

app.get("/adminDashboard", (req, res) => {
    Room.find({})
    .exec()
    .then((rooms) => {
        rooms = rooms.map(value => value.toObject()); 
        res.render("layouts/main", {data: {"adminDashboard": true, "roomList": true, rooms}});
    });
})

app.post("/destination", (req, res) => {
    const destination = req.body.destination;
    Room.find({location: destination})
    .exec()
    .then((rooms) => {
        rooms = rooms.map(value => value.toObject());
        res.render("layouts/main", {data: {"roomList": true, rooms}});
    });    
})

// use query to pass info
app.get("/roomDescription", (req, res) => {
    // query the room based on the room number
    Room.find({"number": req.query.roomNo})
    .exec()
    .then((rooms) => {
        rooms = rooms.map(value => value.toObject()); 
        // if found, then extract the data and pass to template
        if (rooms[0]){
            var room = rooms[0];
            room.roomDescription = true;
            res.render("layouts/main", room);
        }
    })    
})

app.get("/registration", (req, res) => {
    let renderList = {
        registForm: true
    }
    res.render('layouts/main', {
        data: renderList
    });
});

app.get("/roomlist", (req, res) => {
    // query database and get all room info
    Room.find({})
    .exec()
    .then((rooms) => {
        rooms = rooms.map(value => value.toObject()); 
        res.render('layouts/main', {data: {roomList: true, rooms}});     
    });
});

app.post("/register-user", (req, res) => {
    // validation
    let check1 = formValidation.formHasEmpty(req.body);
    let check2 = formValidation.isGoodEmail(req.body.email);
    let check3 = formValidation.isGoodPassword(req.body.createPassword);
    let check4 = formValidation.passwordMatch(req.body.createPassword, req.body.confirmPassword);
    let check5 = formValidation.firstNameEmpty(req.body.firstName);
    let check6 = formValidation.lastNameEmpty(req.body.lastName);
    let check7 = formValidation.monthEmpty(req.body.month);
    let check8 = formValidation.dayEmpty(req.body.day);
    let check9 = formValidation.yearEmpty(req.body.year);
    
    if (formValidation.isValid(req.body)) {
        // save the data to DB
        var newMember = new User({
            email: req.body.email,
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            month: req.body.month,
            day: req.body.day,
            year: req.body.year,
            type: "member",
            subscribe: req.body.subscribeCheck
        });

        var hash = bcrypt.hashSync(req.body.createPassword, salt);
        newMember.password = hash;

        newMember.save((err) => {
            if(err) {
              console.log(`There was an error saving the new member: ${err}`);
            } else {
                console.log("The new member was saved to the web322_assignment collection");
                User.findOne({ email: req.body.email })
                .exec()
                .then((user) => {
                    if(!user) {
                        console.log("No user could be found");
                    } else {
                        console.log(user);
                    }
                })
                .catch((err) => {
                    console.log(`There was an error: ${err}`);
                });
                let info = newMember;
                info.renderWelcome = true;
                res.render('layouts/main', { data: info });
            }   
        });        
    } else {
        let info = req.body;
        info.registFeedback = true;
        info.firstTime = false;
        info.isGoodEmail = check2;
        info.isGoodPassword = check3;
        info.passwordMatch = check4;
        info.firstNameEmpty = check5;
        info.lastNameEmpty = check6;
        info.monthEmpty = check7;
        info.dayEmpty = check8;
        info.yearEmpty = check9;

        console.log(info);

        res.render('layouts/main', {
            data: info
        });
    }
});

app.post("/registRoom", upload.single("photo"), (req, res) => {
    // build a new room
    var newRoom = new Room({
        "title": req.body.title,
        "src": "img/" + req.file.filename,
        "description": req.body.description,
        "location": req.body.location,
        "price": req.body.price
    });

    // get the number of rooms in the db
    Room.find({})
    .exec()
    .then((rooms) => {
        rooms = rooms.map(value => value.toObject());
        newRoom.number = rooms.length + 1;
        // save the new room
        newRoom.save();
        newRoom = newRoom.toObject();
        rooms.push(newRoom);
        res.render("layouts/main", {data: {"adminDashboard": true, "roomList": true, rooms}});
    });
})

app.post("/modifyRoom", upload.single("photo"), (req, res) => {
    Room.updateOne(
        { number: req.body.roomNumber},
        { 
            $set: { 
                title: req.body.title,
                price: parseInt(req.body.price),
                description: req.body.description,
                location: req.body.location,
                src: "img/" + req.file.filename
            }
        },
        function(err, docs) {
            if (err){ 
                console.log(err) 
            } 
            else{ 
                console.log("Updated Docs : ", docs); 
                Room.find({})
                .exec()
                .then((rooms) => {
                    rooms = rooms.map(value => value.toObject());
                    res.render("layouts/main", {data: {"adminDashboard": true, "roomList": true, rooms}});
                });
            } 
        }
    )
    .exec();    
})

app.post("/bookRoom", (req, res) => {
    let info = req.body;
    let user = req.session.user;
    console.log(req.body);
    Room.find({"number": req.body.roomNumber})
    .exec()
    .then((rooms) => {
        rooms = rooms.map(value => value.toObject()); 
        let room = rooms[0];
        console.log("this is the room: ");
        console.log(room);
        console.log("this is the user's info: ")
        console.log(user);
        res.render("layouts/main", {"bookSuccess": true, info, room, user});
    })   
})

app.listen(HTTP_PORT, onHttpStart);