require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const Student = require("./models/student");
passport.use(Student.createStrategy());

passport.serializeUser(function(Student, done) {
  done(null, Student);
});
 
passport.deserializeUser(function(Student, done) {
  done(null, Student);
});
const app = express();

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

try {
  mongoose.connect(
    process.env.URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Mongoose connected")
  );
} catch (e) {
  console.log("Failed to connect to mongoose!");
}

mongoose.set("useCreateIndex",true);

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {

  Student.register({username: req.body.username}, req.body.password, function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req,res,function(){
        res.redirect("/dashboard");
      })
    }
  })
});



app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const student = new Student({
    username: req.body.username,
    password: req.body.password
  })
  
  req.login(student, function(err){
    if(err){
      console.log(err);
    } else {
      passport.authenticate("local", { failureRedirect: '/register' }), (req, res, function(){
        res.redirect("/dashboard");
      });
    }
  });
});


app.get("/dashboard", function(req,res){
  if(req.isAuthenticated()){
    res.render("studentdashboard", {
      fname: "Hello",
      lname: "Hello",
      prn: "Hello",
      department: "Hello",
      year: "Hello",
      pstatus: "Hello",
      cgpi: "Hello",
      skills: "Hello",
      achievements: "Hello",
      phone: "Hello",
      email: "Hello"
    });
  }else {
    res.redirect("/login");
  }
})




app.listen(3000, function () {
  console.log("Server started on port 3000...");
});
