import * as availabilityService from "../service/availability.service.js";

export const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const slots = await availabilityService.getDoctorAvailability(
      doctorId,
      date
    );

    res.json({
      date,
      slots
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};