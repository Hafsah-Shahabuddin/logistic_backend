const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  tracking_number: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);
