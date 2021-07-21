// Imports
const express = require("express");
const app = express();
const port = 3000;
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
var session = require("express-session");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

//session
app.use(
  session({
    key: "user_sid",
    secret: "bettersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

app.use(express.json());
var database;

// Static Files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));

// Set Views
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index");
});

//Homepage
app.get("/home", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/login/:id", (req, res) => {
  console.log(req.params);
});
app.get("/placements", (req, res) => {
  res.render("placement");
});

app.get("/download", (req, res) => {
  res.render("download");
});
//student
app.get("/academics", (req, res) => {
  database
    .collection("students")
    .find({ PRN: "118A1064" })
    .toArray((error, result) => {
      if (error) {
        throw error;
      }
      res.render("studentacad", {
        cgpi: `${result[0].CGPI}`,
        cgpi1: `${result[0].SGPI[0]}`,
        cgpi2: `${result[0].SGPI[1]}`,
        cgpi3: `${result[0].SGPI[2]}`,
        cgpi4: `${result[0].SGPI[3]}`,
        cgpi5: `${result[0].SGPI[4]}`,
        cgpi6: `${result[0].SGPI[5]}`,
      });
    });
});

app.get("/achievements", (req, res) => {
  res.render("studentachmnt");
});

app.get("/placement", (req, res) => {
  res.render("studentplace");
});

app.get("/announcements", (req, res) => {
  res.render("studentanno");
});

app.get("/dashboard", (req, res) => {
  database
    .collection("students")
    .find({ PRN: "118A1064" })
    .toArray((error, result) => {
      if (error) {
        throw error;
      }
      res.render("studentdashboard", {
        fname: `${result[0].Fname}`,
        lname: `${result[0].Lname}`,
        prn: `${result[0].PRN}`,
        department: `${result[0].Branch}`,
        year: `${result[0].Year}`,
        pstatus: `${result[0].PStatus}`,
        cgpi: `${result[0].CGPI}`,
        skills: `${result[0].Tskills[0]}`,
        achievements: `${result[0].achieve}`,
        phone: `${result[0].Phone}`,
        email: `${result[0].email}`,
      });
    });
});

//Admin

app.get("/announce", (req, res) => {
  res.render("adminannounce");
});

app.get("/statistics", (req, res) => {
  res.render("admindashstats");
});

app.get("/messages", (req, res) => {
  res.render("adminmessages");
});

app.get("/users", (req, res) => {
  res.render("adminmessages");
});

app.get("/dashboard_admin", (req, res) => {
  res.render("admindashboard");
});

app.get("/index", (req, res) => {
  res.render("index");
  console.log(req.body);
});

//Teacher

app.get("/tdashboard", (req, res) => {
  res.render("teacherdashboard");
});

app.get("/tplacement", (req, res) => {
  database
    .collection("students")
    .find({ PStatus: "Placed" })
    .toArray((error, result) => {
      if (error) {
        throw error;
      }
      database
        .collection("students")
        .find({ PStatus: "Not Placed" })
        .toArray((err, result1) => {
          if (err) {
            throw err;
          }
          database
            .collection("students")
            .find({ PStatus: "Placed", BranchSF: "CE" })
            .toArray((e, result2) => {
              if (e) {
                throw e;
              }
              database
                .collection("students")
                .find({ PStatus: "Not Placed", BranchSF: "CE" })
                .toArray((er, result3) => {
                  if (er) {
                    throw er;
                  }
                  res.render("teacherplacement", {
                    placed: `${result.length}`,
                    nplaced: `${result1.length}`,
                    ceplaced: `${result2.length}`,
                    cenplaced: `${result3.length}`,
                  });
                  console.log(result);
                });
            });
        });
    });
});

app.get("/tannouncements", (req, res) => {
  res.render("teacheranno");
});

app.get("/tstudents", (req, res) => {
  res.render("teacherstud");
});

//  Listen on port 3000
app.listen(port, () => {
  MongoClient.connect(
    "mongodb+srv://tejas190899:oVs2WRkD9wBgr55d@placement.bjqlg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true },
    (error, result) => {
      if (error) {
        throw error;
      }
      database = result.db("placement_website");
      console.log("Connection Success");
    }
  );
  console.info(`Listening on port ${port}`);
});
