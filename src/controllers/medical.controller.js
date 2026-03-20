import * as medicalService from "../service/medical.service.js";
import Doctor from "../models/doctor.model.js";

export const addMedicalRecord = async (req, res) => {
  try {
    const record = await medicalService.createMedicalRecord({
      ...req.body,
      doctorId: req.user.id
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getPatientHistory = async (req, res) => {
  try {
    const data = await medicalService.getPatientHistory(req.params.patientId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyHistory = async (req, res) => {
  const data = await medicalService.getPatientHistory(req.user.id);
  res.json(data);
};


export const getDoctorPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const data = await medicalService.getDoctorPatients(doctor._id);

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🛠️ Admin View
export const getAllRecords = async (req, res) => {
  try {
    const data = await medicalService.getAllRecords();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};