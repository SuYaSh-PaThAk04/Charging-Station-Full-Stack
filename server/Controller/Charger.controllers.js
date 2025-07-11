import {Charger} from '../Models/Station.Models.js';
import { asyncHandler } from '../Utils/asyncHandller.js';

export const getAllChargers = async (req, res) => {
  try {
    const chargers = await Charger.find();
    res.json(chargers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chargers' });
  }
};

export const createCharger = async (req, res) => {
  try {
    const { name, latitude, longitude,location, powerOutput, status, connectorType } = req.body;

    if (!name || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required fields" });
    }

const newCharger = new Charger({
  name,
  latitude: parseFloat(latitude),
  longitude: parseFloat(longitude),
  powerOutput,
  status,
  connectorType,
  location: {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
  },
  
});
    await newCharger.save();

    res.status(201).json({ message: "Charger created", charger: newCharger });
  } catch (err) {
    console.error("Error creating charger:", err);
    res.status(500).json({ error: "Failed to create charger" });
  }
};

export const updateCharger = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedCharger = await Charger.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCharger) {
      return res.status(404).json({ error: "Charger not found" });
    }

    res.status(200).json(updatedCharger);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update charger" });
  }
});

export const deleteCharger = async (req, res) => {
  try {
    const charger = await Charger.findByIdAndDelete(req.params.id);
    if (!charger) return res.status(404).json({ error: 'Charger not found' });
    res.json({ message: 'Charger deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete charger' });
  }
};
