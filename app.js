const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

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

const userSchema = {
  email: String,
  password: String,
  role: String,
};

const User = new mongoose.model("User", userSchema);

app.get("/register", function(req, res){
 res.render("register")
})

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
        role: req.body.role
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
  
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("studentdashboard", {
            fname: `${foundUser.email}`,
            lname: `${foundUser.email}`,
            prn: `${foundUser.email}`,
            department: `${foundUser.email}`,
            year: `${foundUser.email}`,
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
