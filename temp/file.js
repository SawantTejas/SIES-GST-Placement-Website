const csvtojson = require("csvtojson");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Student = require("../models/student1");
const encrypt = require("mongoose-encryption")
//const fs = require("fs");

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

app.get("/test", function (req, res) {
  res.render("test");
});

app.post("/test", async function (req, res) {
  const csvfilepath = await req.body.file;
   await csvtojson().fromFile(csvfilepath).then((json) => {
      var i;
      for (i = 0; i < json.length; i++) {
        console.log(json[i].fname)
        
        const newStudent = new Student({
            fname: json[i].fname,
            lname: json[i].nlame,
            prn: json[i].prn,
            username: json[i].email,
            password: json[i].password,
            department: json[i].department,
            year: json[i].year,
            batch: json[i].batch,
            placement_Status: json[i].placement_Status
        })
        newStudent.save(function(err){
            if(err){
                console.log(err);
            }
        })
      }
    });
});
/*
const csvfilepath = "simple.csv"

csvtojson()
.fromFile(csvfilepath)
.then((json) => {
    var i;
    for(i = 0; i<json.length; i++){
    console.log(json[i].fname)
    }
}) */
app.listen(3000, function () {
    console.log("Server started on port 3000...");
  });
  