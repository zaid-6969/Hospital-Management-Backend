import PatientDetails from "../models/patientDetails.model.js";
import Appointment from "../models/appointment.model.js";

// ✅ CREATE or UPDATE patient details for an appointment
export const upsertPatientDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Verify the appointment belongs to this patient
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patientId: req.user.id,
    });

    if (!appointment) {
      return res
        .status(403)
        .json({ message: "Appointment not found or access denied" });
    }

    const payload = {
      ...req.body,
      appointmentId,
      patientId: req.user.id,
      doctorId: appointment.doctorId,
    };

    // Upsert — create if missing, update if exists
    const details = await PatientDetails.findOneAndUpdate(
      { appointmentId },
      payload,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(details);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ GET patient details for an appointment (patient sees own, doctor/reception sees all)
export const getPatientDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const details = await PatientDetails.findOne({ appointmentId })
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization");

    if (!details) {
      return res.status(404).json({ message: "Patient details not found" });
    }

    // PATIENT can only see their own
    if (
      req.user.role === "PATIENT" &&
      details.patientId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET all patient details for a doctor's appointments
export const getMyPatientsDetails = async (req, res) => {
  try {
    const details = await PatientDetails.find({ doctorId: req.params.doctorId })
      .populate("patientId", "name email")
      .populate("appointmentId", "date time status")
      .sort({ createdAt: -1 });

    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE patient details (admin only)
export const deletePatientDetails = async (req, res) => {
  try {
    await PatientDetails.findOneAndDelete({
      appointmentId: req.params.appointmentId,
    });
    res.json({ message: "Patient details deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
