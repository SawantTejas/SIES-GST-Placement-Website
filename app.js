//jshint esversion:6
require("dotenv").config();
const fs = require("fs");
const express = require("express");
const csvtojson = require("csvtojson");
var csv = require("fast-csv");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Placement = require("./models/placement");
var user1;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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
  kt: [{ sem: String, subject: String }],
  sgpi: [String],
  placement_Status: String,
  placement_hist: [{ Company: String, Package: String, Role: String }],
  achieve: [{ atitle: String, certi: String }],
  skills: [{ name: String, type: String }],
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
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  Teacher.findById(id, function (err, user) {
    done(err, user);
  });
});
//*******************************************************************render functions
//homepage
app.get("/", function (req, res) {
  res.render("index");
});
app.get("/index", function (req, res) {
  res.render("index");
});

//misc,forms
app.get("/error", function (req, res) {
  res.render("error");
});
app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/test", function (req, res) {
  res.render("test");
});

app.get("/addteacher", function (req, res) {
  res.render("addteacher");
});
app.get("/addplacement", function (req, res) {
  res.render("addplacement");
});
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
  user1 = 0;
});

//student

app.get("/dashboard", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Student") {
    Student.findOne({ username: user1.username }, function (err, student) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("studentdashboard", {
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
  } else {
    res.redirect("/error");
  }
});

app.get("/academics", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Student") {
    Student.findOne({ username: user1.username }, function (err, student) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Project.find({ psname: user1.username }, function (err, allDetails) {
          if (err) {
            console.log(err);
          } else {
            res.render("studentacad", { details: allDetails });
          }
        });
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.get("/achievements", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Student") {
    Student.findOne({ username: user1.username }, function (err, student) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Achievement.find(
          { asname: user1.username },
          function (err, allDetails) {
            if (err) {
              console.log(err);
            } else {
              res.render("studentachmnt", { details: allDetails });
            }
          }
        );
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.get("/announcements", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Student") {
    Student.findOne({ username: user1.username }, function (err, student) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Announcements.find({}, function (err, allDetails) {
          if (err) {
            console.log(err);
          } else {
            res.render("studentanno", { details: allDetails });
          }
        });
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.get("/placement", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Student") {
    Student.findOne({ username: user1.username }, function (err, student) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Student.findOne({ username: user1.username }, function (err, requser) {
          if (err) {
            console.log(err);
          } else {
            Placement.find({ prn: requser.prn }, function (req, placementdata) {
              if (err) {
                console.log(err);
              } else {
                res.render("studentplace", { placedata: placementdata });
                console.log(placementdata);
              }
            });
          }
        });
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.get("/formstudent", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Student") {
    Student.findOne({ username: user1.username }, function (err, student) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("form2");
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.post("/formstudent", function(req, res){
  Student.update({username: user1.username},{$set: { "fname": req.body.upfname, "lname": req.body.uplname, "department": req.body.upbranch, "year": req.body.upphone}}, function(err, user) {
    if (err) throw error
    console.log(user);
    console.log("update user complete");
    res.redirect("/dashboard");
});
})

app.get("/formteacher", function(req, res){
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
  res.render("form6");
}
});
} else{
  res.redirect("/error");
}
});

app.post("/formteacher", function(req, res){
  Teacher.update({username: user1.username},{$set: { "fname": req.body.upfname, "lname": req.body.uplname, "department": req.body.upbranch}}, function(err, user) {
    if (err) throw error
    console.log(user);
    console.log("update user complete");
    res.redirect("/tdashboard");
});
})
//teacher
app.get("/tdashboard", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Teacher") {
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("teacherdashboard", {
          fname: teacher.fname,
          lname: teacher.lname,
          dep: teacher.department,
          role: teacher.role,
          username: teacher.username,
        });
      }
    });
  } else {
    res.redirect("/error");
  }
});
app.get("/tplacement", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Teacher") {
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Student.find(
          { placement_Status: "Not Placed" },
          function (req, np_students) {
            if (err) {
              console.log(err);
            }
            Student.find(
              { placement_Status: "Placed" },
              function (req, placed_students) {
                if (err) {
                  console.log(err);
                }
                Student.find(
                  { placement_Status: "Placed", department: "CE" },
                  function (req, ce_p) {
                    if (err) {
                      console.log(err);
                    }
                    Student.find(
                      { placement_Status: "Placed", department: "IT" },
                      function (req, it_p) {
                        if (err) {
                          console.log(err);
                        }
                        Student.find(
                          { placement_Status: "Placed", department: "MECH" },
                          function (req, mech_p) {
                            if (err) {
                              console.log(err);
                            }
                            Student.find(
                              {
                                placement_Status: "Placed",
                                department: "EXTC",
                              },
                              function (req, extc_p) {
                                if (err) {
                                  console.log(err);
                                }
                                Student.find(
                                  {
                                    placement_Status: "Placed",
                                    department: "PPT",
                                  },
                                  function (req, ppt_p) {
                                    if (err) {
                                      console.log(err);
                                    }
                                    Placement.find(
                                      {},
                                      function (req, placementdata) {
                                        if (err) {
                                          console.log(err);
                                        }
                                        res.render("teacherplacement", {
                                          stud: np_students.length,
                                          placed: placed_students.length,
                                          ce: ce_p.length,
                                          it: it_p.length,
                                          mech: mech_p.length,
                                          extc: extc_p.length,
                                          ppt: ppt_p.length,
                                          placement: placementdata,
                                        });
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    });
  } else {
    res.redirect("/error");
  }
});
app.get("/tstudents", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Teacher") {
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Student.find({}, function (err, allDetails) {
          if (err) {
            console.log(err);
          } else {
            res.render("teacherstud", { details: allDetails });
          }
        });
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.post("/tstud", function (req, res) {
  var appbranch = req.body.branchsrch;
  var appprn = req.body.prnsrch;
  var appname = req.body.studname;
  console.log(appbranch);
  console.log(appprn);
  console.log(appname);
  if (!appprn && !appname && appbranch) {
    Student.find({ department: appbranch }, function (err, allDetails) {
      if (err) {
        console.log(err);
      } else {
        res.render("teacherstud", { details: allDetails });
      }
    });
  } else if (appprn && !appname && !appbranch) {
    Student.find({ prn: req.body.prnsrch }, function (err, allDetails) {
      if (err) {
        console.log(err);
      } else {
        res.render("teacherstud", { details: allDetails });
      }
    });
  } else if (!appprn && appname && !appbranch) {
    Student.find({ fname: req.body.studname }, function (err, allDetails) {
      if (err) {
        console.log(err);
      } else {
        res.render("teacherstud", { details: allDetails });
      }
    });
  } else if (appprn && appname && appbranch) {
    Student.find(
      {
        fname: req.body.studname,
        prn: req.body.prnsrch,
        department: appbranch,
      },
      function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          res.render("teacherstud", { details: allDetails });
        }
      }
    );
  } else if (appprn && appname && !appbranch) {
    Student.find(
      { fname: req.body.studname, prn: req.body.prnsrch },
      function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          res.render("teacherstud", { details: allDetails });
        }
      }
    );
  } else if (appprn && !appname && appbranch) {
    Student.find(
      { prn: req.body.prnsrch, department: appbranch },
      function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          res.render("teacherstud", { details: allDetails });
        }
      }
    );
  } else if (!appprn && appname && appbranch) {
    Student.find(
      { fname: req.body.studname, department: appbranch },
      function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          res.render("teacherstud", { details: allDetails });
        }
      }
    );
  }
});

app.get("/tannouncements", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Teacher") {
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Announcements.find({}, function (err, allDetails) {
          if (err) {
            console.log(err);
          } else {
            res.render("teacheranno", { details: allDetails });
          }
        });
      }
    });
  } else {
    res.redirect("/error");
  }
});

//admin
app.get("/dashboard_admin", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Admin") {
    Admin.findOne({ username: user1.username }, function (err, admin) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("admindashboard", { 
          fname: admin.fname,
          lname: admin.lname,
          username: admin.username,
        });
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.get("/statistics", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Admin") {
    Teacher.findOne({ username: user1.username }, function (err, admin) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Student.find(
          { placement_Status: "Not Placed" },
          function (req, np_students) {
            if (err) {
              console.log(err);
            }
            Student.find(
              { placement_Status: "Placed" },
              function (req, placed_students) {
                if (err) {
                  console.log(err);
                }
                Student.find(
                  { placement_Status: "Placed", department: "CE" },
                  function (req, ce_p) {
                    if (err) {
                      console.log(err);
                    }
                    Student.find(
                      { placement_Status: "Placed", department: "IT" },
                      function (req, it_p) {
                        if (err) {
                          console.log(err);
                        }
                        Student.find(
                          { placement_Status: "Placed", department: "MECH" },
                          function (req, mech_p) {
                            if (err) {
                              console.log(err);
                            }
                            Student.find(
                              {
                                placement_Status: "Placed",
                                department: "EXTC",
                              },
                              function (req, extc_p) {
                                if (err) {
                                  console.log(err);
                                }
                                Student.find(
                                  {
                                    placement_Status: "Placed",
                                    department: "PPT",
                                  },
                                  function (req, ppt_p) {
                                    if (err) {
                                      console.log(err);
                                    }
                                    Placement.find(
                                      {},
                                      function (req, placementdata) {
                                        if (err) {
                                          console.log(err);
                                        }
                                        res.render("admindashstats", {
                                          stud: np_students.length,
                                          placed: placed_students.length,
                                          ce: ce_p.length,
                                          it: it_p.length,
                                          mech: mech_p.length,
                                          extc: extc_p.length,
                                          ppt: ppt_p.length,
                                          placement: placementdata,
                                        });
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.get("/messages", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Admin") {
    Teacher.findOne({ username: user1.username }, function (err, admin) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("adminmessages");
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.get("/announce", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Admin") {
    Teacher.findOne({ username: user1.username }, function (err, admin) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        Announcements.find({}, function (err, allDetails) {
          if (err) {
            console.log(err);
          } else {
            res.render("adminannounce", { details: allDetails });
          }
        });
      }
    });
  } else {
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
app.post("/register", function (req, res) {
  var newAdmin = new Admin({
    fname: req.body.fname,
    lname: req.body.lname,
    username: req.body.username,
    role: "Admin",
  });
  newAdmin.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
  User.register(
    { username: req.body.username, role: "Admin" },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/login");
        });
      }
    }
  );
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        user1 = req.user;
        if (user1.role == "Student") {
          res.redirect("/dashboard");
        } else if (user1.role == "Teacher") {
          res.redirect("/tdashboard");
        } else if (user1.role == "Admin") {
          res.redirect("/dashboard_admin");
        } else {
          res.redirect("/error");
        }
      });
    }
  });
});

//csv for student
app.post("/test", function (req, res) {
  const csvfilepath = req.body.file;
  csvtojson()
    .fromFile(csvfilepath)
    .then((json) => {
      var i;
      for (i = 0; i < json.length; i++) {
        console.log(json[i].password);

        var newUser = {
          username: json[i].email,
          role: "Student",
        };
        User.register(newUser, json[i].password, function (err, user) {
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
          role: "Student",
        });
        newStudent.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  res.redirect("/test");
});

//csv for teacher
app.post("/addteacher", function (req, res) {
  const csvfilepath1 = req.body.file;
  csvtojson()
    .fromFile(csvfilepath1)
    .then((json) => {
      var i;
      for (i = 0; i < json.length; i++) {
        console.log(json[i].fname);
        var newUser = {
          username: json[i].email,
          role: "Teacher",
        };
        User.register(newUser, json[i].password, function (err, user) {
          if (err) {
            console.log(err);
          }
        });
        var newTeacher = new Teacher({
          fname: json[i].fname,
          lname: json[i].lname,
          username: json[i].email,
          department: json[i].department,
          role: "Teacher",
        });
        newTeacher.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  res.redirect("/addteacher");
});

//csv for placement

app.post("/addplacement", function (req, res) {
  const csvfilepath2 = req.body.file;
  csvtojson()
    .fromFile(csvfilepath2)
    .then((json) => {
      var i;
      for (i = 0; i < json.length; i++) {
        var prn = json[i].prn;
        const newPlacement = new Placement({
          company: json[i].company,
          stipend: json[i].stipend,
          role: json[i].role,
          campus: "On-Campus",
          prn: json[i].prn,
        });
        newPlacement.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            Student.update(
              { prn: prn },
              { $set: { placement_Status: "Placed" } },
              function (err, user) {
                if (err) throw error;
                console.log(user);
                console.log("update user complete");
                res.redirect("/addplacement");
              }
            );
          }
        });
      }
    });
});

app.get("/users", function (req, res) {
  Student.find({}, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { details: allDetails });
    }
  });
});

app.post("/users", function (req, res) {
  var appbranch = req.body.branchsrch;
  var appprn = req.body.prnsrch;
  var appname = req.body.studname;
  console.log(appbranch);
  console.log(appprn);
  console.log(appname);
  if (!appprn && !appname && appbranch) {
    Student.find({ department: appbranch }, function (err, allDetails) {
      if (err) {
        console.log(err);
      } else {
        res.render("edit", { details: allDetails });
      }
    });
  } else if (appprn && !appname && !appbranch) {
    Student.find({ prn: req.body.prnsrch }, function (err, allDetails) {
      if (err) {
        console.log(err);
      } else {
        res.render("edit", { details: allDetails });
      }
    });
  } else if (!appprn && appname && !appbranch) {
    Student.find({ fname: req.body.studname }, function (err, allDetails) {
      if (err) {
        console.log(err);
      } else {
        res.render("edit", { details: allDetails });
      }
    });
  } else if (appprn && appname && appbranch) {
    Student.find(
      {
        fname: req.body.studname,
        prn: req.body.prnsrch,
        department: appbranch,
      },
      function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          res.render("edit", { details: allDetails });
        }
      }
    );
  } else if (appprn && appname && !appbranch) {
    Student.find(
      { fname: req.body.studname, prn: req.body.prnsrch },
      function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          res.render("edit", { details: allDetails });
        }
      }
    );
  } else if (appprn && !appname && appbranch) {
    Student.find(
      { prn: req.body.prnsrch, department: appbranch },
      function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          res.render("edit", { details: allDetails });
        }
      }
    );
  } else if (!appprn && appname && appbranch) {
    Student.find(
      { fname: req.body.studname, department: appbranch },
      function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          res.render("edit", { details: allDetails });
        }
      }
    );
  }
});

app.get("/addstud", function (req, res) {
  res.render("addstud");
});

app.post("/addstud", function (req, res) {
  var newUser = {
    username: req.body.email,
    role: "Student",
  };
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
    }
  });
  const newStudent = new Student({
    prn: req.body.prn,
    username: req.body.email,
    placement_Status: req.body.placement_Status,
    role: "Student",
  });
  newStudent.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/addstud");
    }
  });
});
const projectSchema = new mongoose.Schema({
  pstitle: String,
  pswdym: String,
  psdesc: String,
  psgit: String,
  psname: String,
});

const Project = new mongoose.model("projects", projectSchema);

app.get("/projform", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Student") {
    Student.findOne({ username: user1.username }, function (err, student) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("form1");
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.post("/projform", function (req, res) {
  var projdetails = new Project({
    pstitle: req.body.ptitle,
    pswdym: req.body.pwdym,
    psdesc: req.body.pdesc,
    psgit: req.body.pgit,
    psname: user1.username,
  });
  projdetails.save();
  res.redirect("/achievements");
});

const achSchema = new mongoose.Schema({
  astitle: String,
  aswdym: String,
  asdesc: String,
  asname: String,
});

const Achievement = new mongoose.model("achievements", achSchema);

app.get("/achform", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Student") {
    Student.findOne({ username: user1.username }, function (err, student) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("form3");
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.post("/achform", function (req, res) {
  var achdetails = new Achievement({
    astitle: req.body.atitle,
    aswdym: req.body.awdym,
    asdesc: req.body.adesc,
    asname: user1.username,
  });
  achdetails.save();
  res.redirect("/achievements");
});

const announceSchema = new mongoose.Schema({
  annstitle: String,
  annsdescription: String,
  annslink: String,
});

const Announcements = new mongoose.model("announcement", announceSchema);

app.get("/announceform", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Teacher") {
    Teacher.findOne({ username: user1.username }, function (err, teacher) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("form4");
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.post("/announceform", function (req, res) {
  var announcedetail = new Announcements({
    annstitle: req.body.annstitle,
    annsdescription: req.body.annsdescription,
    annslink: req.body.annslink,
  });
  announcedetail.save();
  res.redirect("/tannouncements");
});

app.get("/adminannounceform", function (req, res) {
  if (!user1) {
    res.redirect("/error");
  }
  if (user1.role == "Admin") {
    Admin.findOne({ username: user1.username }, function (err, teacher) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("form5");
      }
    });
  } else {
    res.redirect("/error");
  }
});

app.post("/adminannounceform", function (req, res) {
  var announcedetail = new Announcements({
    annstitle: req.body.annstitle,
    annsdescription: req.body.annsdescription,
    annslink: req.body.annslink,
  });
  announcedetail.save();
  res.redirect("/announce");
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
