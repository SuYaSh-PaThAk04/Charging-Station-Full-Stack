import mongoose from "mongoose";
const chargerSchema = new mongoose.Schema({
    name:
      {
        type : String,
        required : true
      },
      location:{
        type: String,
        required : true
      },
      status:{
        type: String,
        required : true
      },
       powerOutput: String,
    connectorType: String,
      latitude: Number,
  longitude: Number
});
export const  Charger = mongoose.model('Charger', chargerSchema);