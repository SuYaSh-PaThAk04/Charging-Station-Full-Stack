import mongoose from "mongoose";

const chargerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  locationName: {
    type: String,
    default : ""
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], 
      required: true,
    },
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'occupied', 'unavailable', 'in use'], // optional, you can customize
  },
  powerOutput: {
    type: String,
  },
  connectorType: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  }
});

// Create a 2dsphere index for geospatial queries
chargerSchema.index({ location: "2dsphere" });

export const Charger = mongoose.model('Charger', chargerSchema);
