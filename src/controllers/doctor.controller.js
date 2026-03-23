import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import getImageKit from "../utils/imagekit.js";
import { toFile } from "@imagekit/nodejs"; // ← import toFile helper

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
      try {
        parsedAvailability = JSON.parse(availability);
      } catch {
        return res.status(400).json({ message: "Invalid availability format" });
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
