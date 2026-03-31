import mongoose from "mongoose";

const patientDetailsSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Basic info
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    phone: { type: String },
    address: { type: String },

    // Vitals
    bodyTemperature: { type: Number }, // in °F
    weight: { type: Number },          // in kg
    height: { type: Number },          // in cm
    bloodPressure: { type: String },   // e.g. "120/80"
    heartRate: { type: Number },       // bpm
    oxygenSaturation: { type: Number }, // %

    // Chief complaint
    symptoms: { type: String },
    allergies: { type: String },
    currentMedications: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("PatientDetails", patientDetailsSchema);
