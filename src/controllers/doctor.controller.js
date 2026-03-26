import Doctor from "../models/doctor.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import getImageKit from "../utils/imagekit.js";
import { toFile } from "@imagekit/nodejs"; // ← import toFile helper
import Appointment from "../models/appointment.model.js"; // ✅ ADD THIS

export const createDoctor = async (req, res) => {
  try {
    const { userId, name, specialization, experience, availability } =
      req.body || {};

    const user = await User.findById(userId);
    if (!user || user.role !== "DOCTOR") {
      return res.status(400).json({ message: "Invalid doctor user" });
    }

    let parsedAvailability = [];

    if (availability) {
      if (typeof availability === "string") {
        try {
          parsedAvailability = JSON.parse(availability);
        } catch {
          return res
            .status(400)
            .json({ message: "Invalid availability format" });
        }
      } else {
        parsedAvailability = availability; // ✅ direct JSON
      }
    }

    let imageData = {};

    if (req.file) {
      const imagekit = getImageKit();

      const result = await imagekit.files.upload({
        file: await toFile(req.file.buffer, req.file.originalname),
        fileName: req.file.originalname,
        folder: "/doctors",
      });

      imageData = {
        url: result.url,
        fileId: result.fileId,
      };
    }

    const doctor = await Doctor.create({
      userId,
      name,
      specialization,
      experience,
      availability: parsedAvailability,
      image: imageData,
    });

    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    let updatedData = { ...req.body };

    if (updatedData.availability) {
      try {
        updatedData.availability = JSON.parse(updatedData.availability);
      } catch {
        return res.status(400).json({ message: "Invalid availability format" });
      }
    }

    if (req.file) {
      const imagekit = getImageKit();

      if (doctor.image?.fileId) {
        await imagekit.files.deleteFile(doctor.image.fileId); // ← .files.deleteFile()
      }

      const result = await imagekit.files.upload({
        // ← .files.upload()
        file: await toFile(req.file.buffer, req.file.originalname),
        fileName: req.file.originalname,
        folder: "/doctors",
      });

      updatedData.image = {
        url: result.url,
        fileId: result.fileId,
      };
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.image?.fileId) {
      await getImageKit().files.deleteFile(doctor.image.fileId);
    }

    await doctor.deleteOne();
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "name email role",
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.params.id; // ✅ simple

    const total = await Appointment.countDocuments({ doctorId });

    const accepted = await Appointment.countDocuments({
      doctorId,
      status: "ACCEPTED",
    });

    const rejected = await Appointment.countDocuments({
      doctorId,
      status: "REJECTED",
    });

    res.json({ total, accepted, rejected });
  } catch (err) {
    console.error("Doctor Stats Error:", err);
    res.status(500).json({ message: err.message });
  }
};
