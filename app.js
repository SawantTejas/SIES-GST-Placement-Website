//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.URL, {useNewUrlParser: true},{ useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const studentSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    prn: String,
    username: String,
    password: String,
    department: String,
    year: String,
    batch: Number,
    cgpi: String,
    kt: [{sem: String, subject: String}],
    sgpi:[String],
    placement_Status: String,
    placement_hist: [{Company: String, Package: String, Role: String}],
    achieve: [{atitle: String, certi: String}],
    skills: [{name: String, type: String}]
  
  });

studentSchema.plugin(passportLocalMongoose);

const Student = new mongoose.model("Student", studentSchema);

passport.use(Student.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Student.findById(id, function(err, user) {
    done(err, user);
  });
});


app.get("/", function(req, res){
  res.render("index");
});


app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/dashboard", function(req, res){
  res.render("test")
});

app.get("/test", function (req, res) {
    res.render("test");
  });

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){

  Student.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/login");
      });
    }
  });

});

app.post("/login", function(req, res){

  const student = new Student({
    username: req.body.username,
    password: req.body.password
  });

  req.login(student, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/test");
      });
    }
  });

});







app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
