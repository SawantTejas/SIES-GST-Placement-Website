require('dotenv').config();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const studentSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  prn: String,
  username: String,
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


studentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Student', studentSchema);
