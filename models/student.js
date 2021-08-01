require('dotenv').config();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const secret = process.env.SECRET
const studentSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  prn: String,
  email: String,
  password: String,
  department: String,
  year: String,
  batch: Number,
  cgpi: String,
  kt: [{sem: String, subject: String}],
  sgpi:[String],
  placement_Status: String,
  placement_hist: [{Company: String, Package: String, Role: String}],
  achieve: [{atitle: String, certi: String}],
  skills: [{name: String, type: String}]
  

});


studentSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"],
});

const Student = new mongoose.model("Student", studentSchema);

module.exports = Student;
