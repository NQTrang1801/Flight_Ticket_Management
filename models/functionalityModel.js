const mongoose = require('mongoose');

const functionalitySchema = new mongoose.Schema({
  functionalityCode: { type: String, required: true, unique: true },
  functionalityName: { type: String, required: true },
  screenNameToLoad: { type: String, required: true }
});

const Functionality = mongoose.model('Functionality', functionalitySchema);

module.exports = Functionality;
