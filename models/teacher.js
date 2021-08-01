require('dotenv').config();
const encrypt = require("mongoose-encryption");
const secret = process.env.SECRET
const teacherSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  department: String,
  email: String,
  password: String,
  roles: [String],
});

teacherSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"],
});
const Teacher = new mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
