import http from "http";
import app from "./app.js";
import connectDB from "./config/database.js";
import { initSocket } from "./config/socket.js";
import { initMedicineReminderWorker } from "./workers/medicineReminderWorker.js";
import { initAppointmentReminderWorker } from "./workers/appointmentReminderWorker.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Connect to Database
connectDB();

// Initialize Socket.IO
initSocket(server);

// Start Background Workers
initMedicineReminderWorker();
initAppointmentReminderWorker();

// Start Server
server.listen(PORT, () => {
    console.log(`
    🚀 Server running on port ${PORT}
    🌐 Environment: ${process.env.NODE_ENV || 'development'}
    🔗 Local: http://localhost:${PORT}
    `);
});
