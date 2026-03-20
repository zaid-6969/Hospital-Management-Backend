import * as appointmentService from "../service/appointment.service.js";

export const createAppointment = async (req, res) => {
  try {
    const data = await appointmentService.createAppointment({
      ...req.body,
      patientId: req.user.id,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const acceptAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.acceptAppointment(
      req.params.id,
      req.user.id
    );

    res.json({
      message: "Appointment accepted",
      appointment,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.rejectAppointment(
      req.params.id,
      req.user.id,
      req.body.reason
    );

    res.json({
      message: "Appointment rejected",
      appointment,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};