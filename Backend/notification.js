const EventEmitter = require('events');

class HospitalEvents extends EventEmitter {}

const hospitalEvents = new HospitalEvents();

// Dummy Data (Props Simulation)
const patient = { name: "John Doe", date: "2025-04-05" };
const doctor = { name: "Dr. Smith", specialty: "Cardiology" };
const notificationMessage = "Your appointment has been confirmed!";


// Event: Send notification
hospitalEvents.on('sendNotification', (message) => {
    console.log(Notification, $,{message});
});

// Emit Events (Simulating Function Calls)
hospitalEvents.emit('appointmentBooked', patient);
hospitalEvents.emit('doctorApproved', doctor);
hospitalEvents.emit('sendNotification', notificationMessage);