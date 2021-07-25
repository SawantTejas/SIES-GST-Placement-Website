const mongoose = require('mongoose')

const teacherSchema = {
    fname: String,
    lname: String,
    department: String,
    email: String,
    password: String,
  };
  
  const Teacher = new mongoose.model("Teacher", teacherSchema);

  module.exports =  Teacher