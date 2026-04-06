import * as appointmentService from "../service/appointment.service.js";
import Doctor from "../models/doctor.model.js";
import Appointment from "../models/appointment.model.js";

// ✅ CREATE APPOINTMENT (PATIENT)
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        message: "Doctor is required",
      });
    }

    // ── Slot conflict check ─────────────────────────────────
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: "REJECTED" },
    });

    if (conflict) {
      return res.status(409).json({
        message:
          "This time slot is already booked. Please choose a different slot.",
      });
    }
    // ────────────────────────────────────────────────────────

    const data = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      status: "REQUESTED",
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ ACCEPT APPOINTMENT (DOCTOR ONLY HIS)
export const acceptAppointment = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctorId: doctor._id,
    });

    if (!appointment) {
      return res.status(403).json({
        message: "Not your appointment",
      });
    }

    appointment.status = "ACCEPTED";
    appointment.rejectionReason = "";

    await appointment.save();

    res.json({
      message: "Appointment accepted",
      appointment,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ REJECT APPOINTMENT (DOCTOR ONLY HIS)
export const rejectAppointment = async (req, res) => {
  try {
    const { reason } = req.body;

    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctorId: doctor._id,
    });

    if (!appointment) {
      return res.status(403).json({
        message: "Not your appointment",
      });
    }

    appointment.status = "REJECTED";
    appointment.rejectionReason = reason || "";

    await appointment.save();

    res.json({
      message: "Appointment rejected",
      appointment,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ GET DOCTOR APPOINTMENTS (ONLY HIS)
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
    })
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization image")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ UPDATE STATUS (DOCTOR + RECEPTION SAFE)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    let appointment;

    // 🔥 DOCTOR → only his
    if (req.user.role === "DOCTOR") {
      const doctor = await Doctor.findOne({ userId: req.user.id });

      appointment = await Appointment.findOne({
        _id: req.params.id,
        doctorId: doctor._id,
      });

      if (!appointment) {
        return res.status(403).json({
          message: "Not your appointment",
        });
      }
    } else {
      // 🔥 RECEPTION
      appointment = await Appointment.findById(req.params.id);
    }

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;
    appointment.rejectionReason =
      status === "REJECTED" ? rejectionReason || "" : "";

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL APPOINTMENTS (RECEPTION)
export const getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const total = await Appointment.countDocuments();

    const data = await Appointment.find()
      .populate("patientId", "name")
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ASSIGN DOCTOR (RECEPTION)
export const assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    appointment.doctorId = doctorId;

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADMIN STATS
export const getAdminStats = async (req, res) => {
  try {
    const total = await Appointment.countDocuments();

    const accepted = await Appointment.countDocuments({
      status: "ACCEPTED",
    });

    const rejected = await Appointment.countDocuments({
      status: "REJECTED",
    });

    const requested = await Appointment.countDocuments({
      status: "REQUESTED",
    });

    res.json({
      total,
      accepted,
      rejected,
      requested,
      acceptedPercent: total ? ((accepted / total) * 100).toFixed(1) : 0,
      rejectedPercent: total ? ((rejected / total) * 100).toFixed(1) : 0,
      requestedPercent: total ? ((requested / total) * 100).toFixed(1) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE APPOINTMENT (RECEPTION + ADMIN)
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    await appointment.deleteOne();

    res.json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyAppointmentsPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
    })
      .populate("doctorId", "name specialization image")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// ✅ GET BOOKED SLOTS
export const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ message: "doctorId and date are required" });
    }

    const appointments = await Appointment.find({
      doctorId,
      date,
      status: { $ne: "REJECTED" },
    }).select("time -_id");

    res.json({ bookedSlots: appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE ONLY USER'S OWN APPOINTMENT
export const deleteMyAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found or not yours",
      });
    }

    await appointment.deleteOne();

    res.json({
      message: "Appointment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
