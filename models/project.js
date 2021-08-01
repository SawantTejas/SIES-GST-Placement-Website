const mongoose = require('mongoose')

const projectSchema = {
    name: String,
    description: String,
    sem: String,
    link: String,
    student: [String],
  };
  
  const Project = new mongoose.model("Teacher", projectSchema);

  module.exports =  Project