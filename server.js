const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Shipment = require("./models/Shipment");
const Event = require("./models/Event");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ----------------- MongoDB Connection -----------------
mongoose
  .connect("mongodb://127.0.0.1:27017/logistics")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ----------------- PUBLIC API – Track Shipment -----------------
app.get("/api/track/:tracking_number", async (req, res) => {
  const trackingNumber = req.params.tracking_number;

  try {
    const shipment = await Shipment.findOne({ trackingNumber }); // match schema
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const events = await Event.find({ trackingNumber }); // match schema if Event uses camelCase
    res.json({ shipment, events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- ADMIN – Create Shipment -----------------
app.post("/api/shipments", async (req, res) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.json({ message: "Shipment created", shipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ----------------- ADMIN – Bulk create Shipments -----------------
app.post("/api/shipments/bulk", async (req, res) => {
  try {
    const shipments = req.body; // expects an array of shipment objects
    const result = await Shipment.insertMany(shipments);
    res.json({ message: "Shipments added", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- ADMIN – Add Event -----------------
app.post("/api/shipments/:id/events", async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: validate shipment exists
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // Attach trackingNumber from shipment to event
    const event = new Event({ ...req.body, trackingNumber: shipment.trackingNumber });
    await event.save();
    res.json({ message: "Event added", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- START SERVER -----------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

