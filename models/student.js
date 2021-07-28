const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const studentSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  prn: String,
  email: String,
  password: String,
  department: String,
  year: String,
  batch: Number,
});

const secret = "Topsecretstring.";
studentSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"],
});

const Student = new mongoose.model("Student", studentSchema);

module.exports = Student;
