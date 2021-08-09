//jshint esversion:6
require('dotenv').config();

const fs = require("fs")
const express = require("express");
const csvtojson = require("csvtojson");
var csv = require("fast-csv");
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

mongoose.connect(process.env.URL, {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);


//student schema begins
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
    role: String,
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
//student schema ends


//teacher schema begins
const teacherSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  department: String,
  email: String,
  password: String,
  role: String,
});
teacherSchema.plugin(passportLocalMongoose);
const Teacher = new mongoose.model("Teacher", teacherSchema);
passport.use(Teacher.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  Teacher.findById(id, function(err, user) {
    done(err, user);
  });
});
//teacher schema ends


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

app.get("/addteacher", function (req, res) {
    res.render("addteacher");
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
const username = req.body.username;
var isStudent = False;
var isTeacher = False;
//student finding
Student.findOne({ username: username }, function (err, student) {
  if(err){
    console.log(err);
  }
  else if(student){
    isStudent = True;
  }
  else{
    console.log("User not found");
  }
});
//teacher finding
Teacher.findOne({ username: username }, function (err, teacher) {
  if(err){
    console.log(err);
  }
  else if(teacher){
    isTeacher = True;
  }
  else{
    console.log("User not found");
  }
});

//for student
if(isStudent == True){

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
}


//for teacher
if(isTeacher == True){

  const teacher = new Teacher({
    username: req.body.username,
    password: req.body.password
  });

  req.login(teacher, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/test");
      });
    }
  });
}

});   //login post ends

//csv for student
app.post("/test", async function (req, res) { 
const csvfilepath = await req.body.file;
   await csvtojson().fromFile(csvfilepath).then((json) => {
      var i;
      for (i = 0; i < json.length; i++) {
        console.log(json[i].fname)
        
        var newStudent = {
            fname: json[i].fname,
            lname: json[i].lname,
            prn: json[i].prn,
            username: json[i].email,
            department: json[i].department,
            year: json[i].year,
            batch: json[i].batch,
            placement_Status: json[i].placement_Status,
            role: "Student"
        }
        Student.register(newStudent, json[i].password, function(err, user){
          if (err) {
            console.log(err);
          } 
        });
      }
    });
    res.redirect("/test");
});



//csv for teacher
app.post("/addteacher", async function (req, res) { 
  const csvfilepath1 = await req.body.file;
     await csvtojson().fromFile(csvfilepath1).then((json) => {
        var i;
        for (i = 0; i < json.length; i++) {
          console.log(json[i].fname)
          
          var newTeacher = {
              fname: json[i].fname,
              lname: json[i].lname,
              username: json[i].email,
              department: json[i].department,
              role: "Teacher"
          }
          Teacher.register(newTeacher, json[i].password, function(err, user){
            if (err) {
              console.log(err);
            } 
          });
        }
      });
      res.redirect("/addteacher");
  });
  



app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
