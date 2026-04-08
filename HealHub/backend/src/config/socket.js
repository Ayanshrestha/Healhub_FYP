import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                process.env.APP_URL,
                "http://localhost:3000",
                "http://localhost:5173",
                "https://healhub-frontend-5k65.onrender.com"
            ],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    console.log("📶 Socket.IO Initialized");

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        // Join an active chat room based on Appointment ID
        socket.on("join_chat", (appointmentId) => {
            socket.join(appointmentId);
            console.log(`🏠 User ${socket.id} joined appointment room: ${appointmentId}`);
        });

        // Backward compatibility for old event names (optional, but good for stability during transition)
        socket.on("join_room", (appointmentId) => {
            socket.join(appointmentId);
            console.log(`🏠 (Legacy) User ${socket.id} joined room: ${appointmentId}`);
        });

        socket.on("join_appointment_room", (appointmentId) => {
            socket.join(appointmentId);
            console.log(`🏠 (Frontend Sync) User ${socket.id} joined room: ${appointmentId}`);
        });

        // Join global user room for notifications
        socket.on("join_user_room", (userId) => {
            socket.join(userId);
            console.log(`👤 User ${socket.id} joined global room: ${userId}`);
        });

        socket.on("disconnect", () => {
            console.log(`🚫 User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitToRoom = (roomId, event, data) => {
    if (io) {
        io.to(roomId).emit(event, data);
    }
};
