const encrypt = require("mongoose-encryption");
const teacherSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  department: String,
  email: String,
  password: String,
  roles: [String],
});

const secret = "Topsecretstring.";
teacherSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"],
});
const Teacher = new mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
