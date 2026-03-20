import MedicalRecord from "../models/medicalRecord.model.js";

export const createMedicalRecord = async (data) => {
  return await MedicalRecord.create(data);
};

export const getPatientHistory = async (patientId) => {
  return await MedicalRecord.find({ patientId })
    .populate("doctorId", "userId")
    .populate("appointmentId")
    .sort({ createdAt: -1 });
};


// 👨‍⚕️ Doctor: get all his patients records
export const getDoctorPatients = async (doctorId) => {
  return await MedicalRecord.find({ doctorId })
    .populate("patientId", "name email")
    .sort({ createdAt: -1 });
};

// 🛠️ Admin: get all records
export const getAllRecords = async () => {
  return await MedicalRecord.find()
    .populate("patientId", "name email")
    .populate("doctorId")
    .sort({ createdAt: -1 });
};