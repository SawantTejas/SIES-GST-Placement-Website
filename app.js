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
const Placement = require('./models/placement')
var user1;
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
const Student = new mongoose.model("Student", studentSchema);
//student schema ends


//teacher schema begins
const teacherSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  department: String,
  username: String,
  role: String,
});

const Teacher = new mongoose.model("Teacher", teacherSchema);

const adminSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  username: String,
  role: String,
});

const Admin = new mongoose.model("Admin", adminSchema);


//teacher schema ends
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  Teacher.findById(id, function(err, user) {
    done(err, user);
  });
});
//*******************************************************************render functions
//homepage
app.get("/", function(req, res){
  res.render("index");
});
app.get("/index", function(req, res){
  res.render("index");
});

//misc,forms
app.get("/error", function(req,res){
  res.render("error");
})
app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/test", function (req, res) {
    res.render("test");
  });

app.get("/addteacher", function (req, res) {
    res.render("addteacher");
  });
app.get("/addplacement", function(req,res){
  res.render("addplacement");
});
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

//student

app.get("/dashboard", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Student"){
    Student.findOne({ username: user1.username }, function (err, student) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("studentdashboard",{
        fname: student.fname,
        lname: student.lname,
        prn: student.prn,
        department: student.department,
        year: student.year,
        pstatus: student.placement_Status,
        cgpi: student.cgpi,
        skills: student.skills,
        achievements: student.achieve,
        phone: "NA",
        email: student.username,
  });
}
    });
}else{
  res.redirect("/error");
} 
});

app.get("/academics", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Student"){
    Student.findOne({ username: user1.username }, function (err, student) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("studentacad");
}
});
} else{
  res.redirect("/error");
} 
});

app.get("/achievements", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Student"){
    Student.findOne({ username: user1.username }, function (err, student) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("studentachmnt");
}
});
} else{
  res.redirect("/error");
} 
});

app.get("/announcements", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Student"){
    Student.findOne({ username: user1.username }, function (err, student) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("studentanno");
}
});
} else{
  res.redirect("/error");
} 
});

app.get("/placement", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Student"){
    Student.findOne({ username: user1.username }, function (err, student) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("studentplace");
}
});
} else{
  res.redirect("/error");
} 
});

app.get("/formstudent", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Student"){
    Student.findOne({ username: user1.username }, function (err, student) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("form2");
}
});
} else{
  res.redirect("/error");
} 
});

app.get("/formproject", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Student"){
    Student.findOne({ username: user1.username }, function (err, student) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("form1");
}
});
} else{
  res.redirect("/error");
} 
});

app.get("/formskill", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Student"){
    Student.findOne({ username: user1.username }, function (err, student) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("form3");
}
});
} else{
  res.redirect("/error");
} 
});

//teacher
app.get("/tdashboard", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Teacher"){
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("teacherdashboard");
}
});
} else{
  res.redirect("/error");
} 
});
app.get("/tplacement", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Teacher"){
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("teacherplacement");
}
});
}else{
  res.redirect("/error");
} 
});
app.get("/tstudents", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Teacher"){
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("teacherstud");
}
});
}else{
  res.redirect("/error");
}  
});
app.get("/tannouncements", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Teacher"){
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("teacheranno");
}
});
}else{
  res.redirect("/error");
} 
});

//admin
app.get("/dashboard_admin", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Admin"){
    Teacher.findOne({ username: user1.username }, function (err, admin) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("admindashboard");
}
});
}else{
  res.redirect("/error");
} 
});


app.get("/statistics", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Admin"){
    Teacher.findOne({ username: user1.username }, function (err, admin) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("admindashstats");
}
});
}else{
  res.redirect("/error");
} 
});

app.get("/messages", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Admin"){
    Teacher.findOne({ username: user1.username }, function (err, admin) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("adminmessages");
}
});
}else{
  res.redirect("/error");
} 
});

app.get("/announce", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Admin"){
    Teacher.findOne({ username: user1.username }, function (err, admin) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("adminannounce");
}
});
}else{
  res.redirect("/error");
} 
});

/*
app.get("/users", function(req, res){
  if(!user1){
    res.redirect("/error");
  }
  if(user1.role == "Admin"){
    Teacher.findOne({ username: user1.username }, function (err, admin) {
      if(err){
        console.log(err);
        res.redirect("/error");
      }
      else{
  res.render("users");
}
});
}else{
  res.redirect("/error");
} 
});*/

//************************************************************post requests
app.post("/register", function(req, res){
  var newAdmin = new Admin({
    fname: req.body.fname,
    lname: req.body.lname,
    username: req.body.username,
    role: "Admin"
});
newAdmin.save(function(err){
  if(err){
      console.log(err);
  }
})
  User.register({username: req.body.username, role: "Admin"}, req.body.password, function(err, user){
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
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        user1 = req.user;
        if(user1.role == "Student"){
          res.redirect("/dashboard");
        }
        else if(user1.role == "Teacher"){
          res.redirect("/tdashboard");
        }
        else if(user1.role == "Admin"){
          res.redirect("/dashboard_admin");
        }
        else{
          res.redirect("/error");
        }
      });
    }
  });

});   



//csv for student
app.post("/test",  function (req, res) { 
const csvfilepath =  req.body.file;
    csvtojson().fromFile(csvfilepath).then((json) => {
      var i;
      for (i = 0; i < json.length; i++) {
        console.log(json[i].password)
        
        var newUser = {
            username: json[i].email,
            role: "Student"
        }
        User.register(newUser, json[i].password, function(err, user){
          if (err) {
            console.log(err);
          } 
        });

        const newStudent = new Student({
          fname: json[i].fname,
          lname: json[i].lname,
          prn: json[i].prn,
          username: json[i].email,
          department: json[i].department,
          year: json[i].year,
          batch: json[i].batch,
          placement_Status: json[i].placement_Status,
          role: "Student"
      })
      newStudent.save(function(err){
          if(err){
              console.log(err);
          }
      })

      }
    });
    res.redirect("/test");
});



//csv for teacher
app.post("/addteacher", function (req, res) { 
  const csvfilepath1 = req.body.file;
      csvtojson().fromFile(csvfilepath1).then((json) => {
        var i;
        for (i = 0; i < json.length; i++) {
          console.log(json[i].fname)
          var newUser = {
            username: json[i].email,
            role: "Teacher"
        }
        User.register(newUser, json[i].password, function(err, user){
          if (err) {
            console.log(err);
          } 
        });
          var newTeacher = new Teacher({
              fname: json[i].fname,
              lname: json[i].lname,
              username: json[i].email,
              department: json[i].department,
              role: "Teacher"
          });
          newTeacher.save(function(err){
            if(err){
                console.log(err);
            }
        })
        }
      });
      res.redirect("/addteacher");
  });
  

//csv for placement

app.post("/addplacement",function(req,res){
  const csvfilepath2 = req.body.file;
    csvtojson().fromFile(csvfilepath2).then((json) => {
      var i;
      for (i = 0; i < json.length; i++) {
        var prn = json[i].prn
        const newPlacement = new Placement({
            company: json[i].company,
            stipend: json[i].stipend,
            role: json[i].role,
            campus: "On-Campus",
            prn: json[i].prn,
        })
        newPlacement.save(function(err){
          if(err){
            console.log(err);
        }else{
          Student.update({prn: prn},{$set: { "placement_Status": "Placed"}}, function(err, user) {
            if (err) throw error
            console.log(user);
            console.log("update user complete");
            res.redirect("/addplacement");
        });
        }
    })
  }
});
});



app.get("/users", function (req, res) {
  Student.find({}, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails })
    }
  })
})
app.post("/users", function (req, res) {
  var appbranch = req.body.branchsrch;
  var appprn = req.body.prnsrch;
  var appname = req.body.studname;
  console.log(appbranch);
  console.log(appprn);
  console.log(appname);
  if(!appprn&&!appname&&appbranch){
  Student.find({ department: appbranch }, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails })
    }
  })
}
  else if(appprn&&!appname&&!appbranch){
  Student.find({ prn: req.body.prnsrch }, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails })
    }
  })
}
  else if(!appprn&&appname&&!appbranch){
  Student.find({ fname: req.body.studname }, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails })
    }
  })
}
else if(appprn&&appname&&appbranch){
  Student.find({ fname: req.body.studname, prn: req.body.prnsrch, department: appbranch  }, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails })
    }
  })
}
else if(appprn&&appname&&!appbranch){
  Student.find({ fname: req.body.studname, prn: req.body.prnsrch  }, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails })
    }
  })
}
else if(appprn&&!appname&&appbranch){
  Student.find({ prn: req.body.prnsrch, department: appbranch  }, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails })
    }
  })
}
else if(!appprn&&appname&&appbranch){
  Student.find({ fname: req.body.studname, department: appbranch  }, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails })
    }
  })
}
})

app.get("/addstud", function (req, res) {
res.render("addstud");
});


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
