import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment"
  },

  diagnosis: {
    type: String,
    required: true
  },

  prescription: [
    {
      medicine: String,
      dosage: String,
      duration: String
    }
  ],

  notes: String

}, { timestamps: true });

export default mongoose.model("MedicalRecord", medicalRecordSchema);