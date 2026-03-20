import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    start: String,
    end: String,
  },
  { _id: false },
);

const availabilitySchema = new mongoose.Schema(
  {
    day: String,
    slots: [slotSchema],
  },
  { _id: false },
);

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    specialization: String,
    experience: Number,

    availability: [availabilitySchema],
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", doctorSchema);
