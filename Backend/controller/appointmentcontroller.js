import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    appointment_time, // Added time field
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !appointment_time || // Added validation for time
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;

  // Check if doctor is available at the requested time
  const doctorAppointments = await Appointment.find({
    doctorId,
    appointment_date,
    appointment_time,
    status: "Accepted", // Only consider accepted appointments
  });

  if (doctorAppointments.length > 0) {
    return next(
      new ErrorHandler(
        "Doctor is not available at this time. Please select a different time.",
        400
      )
    );
  }

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    appointment_time, // Added time field to creation
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });

  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    
    // If status is being updated to "Accepted", check for time conflicts
    if (req.body.status === "Accepted") {
      const doctorId = appointment.doctorId;
      const appointmentDate = appointment.appointment_date;
      const appointmentTime = appointment.appointment_time;
      
      // Check for conflicting appointments
      const conflictingAppointments = await Appointment.find({
        doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: "Accepted",
        _id: { $ne: id } // Exclude current appointment
      });
      
      if (conflictingAppointments.length > 0) {
        return next(
          new ErrorHandler(
            "Cannot accept this appointment. Doctor already has an appointment at this time.",
            400
          )
        );
      }
    }
    
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});

// New endpoint to check doctor availability
export const checkDoctorAvailability = catchAsyncErrors(async (req, res, next) => {
  const { doctorId, date, time, appointmentId } = req.query;
  
  // Find conflicting appointments
  const conflictingAppointments = await Appointment.find({
    doctorId,
    appointment_date: date,
    appointment_time: time,
    status: "Accepted", // Only consider accepted appointments as conflicts
    _id: { $ne: appointmentId } // Exclude the current appointment
  });
  
  // Doctor is available if there are no conflicting appointments
  const isAvailable = conflictingAppointments.length === 0;
  
  res.status(200).json({
    success: true,
    isAvailable
  });
});