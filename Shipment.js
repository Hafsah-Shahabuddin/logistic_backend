const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  origin: String,
  destination: String,
  status: String
});

module.exports = mongoose.model("Shipment", shipmentSchema);
