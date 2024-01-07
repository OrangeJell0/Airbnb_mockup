const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

mongoose.connect("mongodb+srv://OrangeJello:rlaxodbs1025@cluster0.xkvvk0b.mongodb.net/", {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new Schema({
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

// create & save administrator
var admin = new User({
  email: "admin@myseneca.ca",
  firstname: "Tony",
  lastname: "Kim",
  month: 1,
  day: 1,
  year: 1990,
  type: "admin",
  subscribe: 1
});

var salt = '$2a$10$g4z4MQjpCexuZ3PN.UOWAe';
var hash = bcrypt.hashSync("abc", salt);
admin.password = hash;
admin.save();

var roomSchema = new Schema({
  "number":  {"type": Number, "unique": true},
  "title": {"type": String, "require": true},
  "src": {"type": String, "require": true},
  "description": {"type": String, "require": true},
  "location": {"type": String, "require": true},
  "price": {"type": Number, "require": true}
});

var Room = mongoose.model("room", roomSchema);

// create rooms
var roomOne = new Room({
  number: 1,
  title: "Room One",
  src: "img/room1.jpg",
  description: "This house is built on water",
  location: "falls",
  price: 99
});
var roomTwo = new Room({
  number: 2,
  title: "Room Two",
  src: "img/room2.jpg",
  description: "The best room in Niagra Falls",
  location: "falls",
  price: 99
});
var roomThree = new Room({
  number: 3,
  title: "Room Three",
  src: "img/room3.jpg",
  description: "Enjoy the winter snow",
  location: "vancouver",
  price: 99
});
var roomFour = new Room({
  number: 4,
  title: "Room Four",
  src: "img/room4.jpg",
  description: "A room with modern technology",
  location: "vancouver",
  price: 99
});
var roomFive = new Room({
  number: 5,
  title: "Room Five",
  src: "img/room5.jpg",
  description: "A room with good light condition",
  location: "banff",
  price: 99
});
var roomSix = new Room({
  number: 6,
  title: "Room Six",
  src: "img/room6.jpg",
  description: "Imagine live in a forest",
  location: "otawwa",
  price: 99
});

// save rooms
roomOne.save();
roomTwo.save();
roomThree.save();
roomFour.save();
roomFive.save();
roomSix.save();
