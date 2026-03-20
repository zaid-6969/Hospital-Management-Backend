import Doctor from "../models/doctor.model.js";
import Appointment from "../models/appointment.model.js";

export const getDoctorAvailability = async (doctorId, date) => {
  // 1. Get doctor
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // 2. Convert date → day
  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "long"
  });

  // 3. Get availability for that day
  const dayAvailability = doctor.availability.find(
    (d) => d.day === dayName
  );

  if (!dayAvailability) {
    return [];
  }

  const allSlots = dayAvailability.slots;

  // 4. Get booked slots
  const bookedAppointments = await Appointment.find({
    doctorId,
    date,
    status: "ACCEPTED"
  });

  const bookedSlots = bookedAppointments.map((a) => a.time);

  // 5. Filter available slots
  const availableSlots = allSlots.filter(
    (slot) => !bookedSlots.includes(`${slot.start} - ${slot.end}`)
  );

  return availableSlots;
};