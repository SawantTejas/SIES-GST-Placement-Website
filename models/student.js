const mongoose = require('mongoose')


const studentSchema = {
    fname: String,
    lname: String,
    prn: String,
    email: String,
    password: String,
    department: String,
    year: String,
    batch: Number,
  };
  
  const Student = new mongoose.model("Student", studentSchema);

  module.exports =  Student