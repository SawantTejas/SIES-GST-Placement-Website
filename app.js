const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Student = require("./models/student")
const app = express();

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

try {
  mongoose.connect(
    "mongodb+srv://tejas190899:oVs2WRkD9wBgr55d@placement.bjqlg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Mongoose connected")
  );
} catch (e) {
  console.log("Failed to connect to mongoose!");
}

app.get("/register", function(req, res){
 res.render("register")
})

app.post("/register", function(req, res){
    const newStudent = new Student({
        email: req.body.username,
        password: req.body.password,
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("login")
        }
    })
})

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const username = req.body.uname;
  const password = req.body.psw;
  
  Student.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("studentdashboard", {
            fname: `${foundUser.fname}`,
            lname: `${foundUser.lname}`,
            prn: `${foundUser.prn}`,
            department: `${foundUser.department}`,
            year: `${foundUser.year}`,
            pstatus: `${foundUser.email}`,
            cgpi: `${foundUser.email}`,
            skills: `${foundUser.email}`,
            achievements: `${foundUser.email}`,
            phone: `${foundUser.email}`,
            email: `${foundUser.email}`,
          });
        }
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000...");
});
