const mongoose = require('mongoose')
const placementSchema = {
    company: String,
    stipend: String,
    role: String,
    year: String,
    prn: String,
  };
  
  const Placement = new mongoose.model("Placement", placementSchema);

  module.exports =  Placement