import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";

export const createAppointment = async (data) => {
  const { doctorId, equipmentId, date, time } = data;

  //  Cannot select both
if (!doctorId && !equipmentId) {
  throw new Error("Select doctor or equipment");
}

// Cannot select both
if (doctorId && equipmentId) {
  throw new Error("Select either doctor OR equipment, not both");
}

  // 🔒 Prevent double booking
  const existing = await Appointment.findOne({
    date,
    time,
    status: "ACCEPTED",
    ...(doctorId ? { doctorId } : { equipmentId }),
  });

  if (existing) {
    throw new Error("Slot already booked");
  }

  const appointment = await Appointment.create(data);

  return appointment;
};

export const acceptAppointment = async (appointmentId, userId) => {
  // 1. Find doctor from logged-in user
  const doctor = await Doctor.findOne({ userId });

  if (!doctor) throw new Error("Doctor not found");

  // 2. Find appointment
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) throw new Error("Appointment not found");

  // 3. Check ownership
  if (appointment.doctorId.toString() !== doctor._id.toString()) {
    throw new Error("Unauthorized");
  }

  // 4. Update status
  appointment.status = "ACCEPTED";

  await appointment.save();

  return appointment;
};

export const rejectAppointment = async (appointmentId, userId, reason) => {
  const doctor = await Doctor.findOne({ userId });

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) throw new Error("Appointment not found");

  appointment.status = "REJECTED";
  appointment.rejectionReason = reason;

  await appointment.save();

  return appointment;
};

export const getDoctorStats = async (doctorId) => {
  const accepted = await Appointment.countDocuments({
    doctorId,
    status: "ACCEPTED",
  });

  const rejected = await Appointment.countDocuments({
    doctorId,
    status: "REJECTED",
  });

  return { accepted, rejected };
};


export const getMyAppointments = async (userId) => {
  const doctor = await Doctor.findOne({ userId });

  if (!doctor) throw new Error("Doctor not found");

  return await Appointment.find({
    doctorId: doctor._id,
  }).populate("patientId", "name email");
};