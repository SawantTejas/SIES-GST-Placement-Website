const mongoose = require('mongoose')

const userSchema = {
    email: String,
    password: String,
    role: String,
  };
  
  const User = new mongoose.model("User", userSchema);

  module.exports =  User