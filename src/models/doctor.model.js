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

     name: {
      type: String,
      required: true,
    },

    specialization: String,
    experience: Number,

    availability: [availabilitySchema],

    image: {
      url: String,
      fileId: String,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", doctorSchema);
