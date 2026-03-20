import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,

  availability: [
    {
      day: String,
      slots: [
        {
          start: String,
          end: String
        }
      ]
    }
  ],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Equipment", equipmentSchema);