import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    console.log("📶 Socket.IO Initialized");

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        // Join a clinical conversation room
        socket.on("join_room", (appointmentId) => {
            socket.join(appointmentId);
            console.log(`🏠 User ${socket.id} joined room: ${appointmentId}`);
        });

        // Join user's private notification room
        socket.on("join_user_room", (userId) => {
            socket.join(userId);
            console.log(`👤 User ${socket.id} joined private room: ${userId}`);
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
