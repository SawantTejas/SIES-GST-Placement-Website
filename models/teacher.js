require('dotenv').config();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const teacherSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  department: String,
  email: String,
  password: String,
  roles: [String],
});

teacherSchema.plugin(passportLocalMongoose);
const Teacher = new mongoose.model("Teacher", teacherSchema);
passport.use(Teacher.createStrategy());
passport.serializeUser(Teacher.serializeUser());
passport.deserializeUser(Teacher.deserializeUser());
module.exports = Teacher;
