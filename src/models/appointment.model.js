import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment"
  },

  date: String,
  time: String,

  status: {
    type: String,
    enum: ["REQUESTED", "ACCEPTED", "REJECTED"],
    default: "REQUESTED"
  },

  rejectionReason: String

}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);