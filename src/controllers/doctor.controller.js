import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";

export const createDoctor = async (req, res) => {
  try {
    const { userId, specialization, experience, availability } = req.body;

    // 🔐 check user
    const user = await User.findById(userId);

    if (!user || user.role !== "DOCTOR") {
      return res.status(400).json({ message: "Invalid doctor user" });
    }

    const doctor = await Doctor.create({
      userId,
      specialization,
      experience,
      availability,
    });

    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};