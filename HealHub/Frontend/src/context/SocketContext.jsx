import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import patientService from "../features/patient/services/patientService";
import * as adminService from "../features/admin/services/adminAuthService";
import clinicService from "../features/clinic/services/clinicService";
import * as providerService from "../features/provider/services/providerService";
import { SOCKET_URL } from "../services/api";

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    const location = useLocation();

    // Sync User State from LocalStorage
    const syncUser = () => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

        const targetUser = window.location.pathname.startsWith('/admin') ? adminUser : (user || adminUser);

        // Only update if something actually changed to avoid re-running initialization effects
        if (targetUser?._id !== currentUser?._id || targetUser?.role !== currentUser?.role) {
            setCurrentUser(targetUser);
        }
    };

    // Sync on mount and route change
    useEffect(() => {
        syncUser();
    }, [location.pathname]);

    // Determine Service based on Role
    let service = patientService; // Default
    if (currentUser?.role === 'admin') service = adminService;
    else if (currentUser?.role === 'clinic') service = clinicService;
    else if (currentUser?.role === 'doctor' || currentUser?.role === 'therapist') service = providerService;

    useEffect(() => {
        if (!currentUser || !currentUser._id) return;

        // Fetch historical notifications
        const fetchHistory = async () => {
            try {
                // Ensure service has getNotifications method
                if (service?.getNotifications) {
                    const data = await service.getNotifications();
                    // Some services return wrapped data, others array. Handle both if needed.
                    // Based on my review:
                    // admin: returns response.data.data (array)
                    // clinic: returns response.data.notifications (array)
                    // provider: returns response.data.data (array)
                    // patient: returns response.data.data (array)
                    // Wait, let's double check implementation of getNotifications in each.
                    // adminAuthService: returns response.data?.data
                    // clinicService: returns response.data.notifications
                    // providerService: returns response.data.data
                    // patientService: returns response.data.data
                    // So we can use data directly if it is array.
                    const list = Array.isArray(data) ? data : (data?.data || []);
                    setNotifications(list);
                    setUnreadCount(list.filter(n => !n.readAt && !n.isRead).length || 0);
                    // Note: clinic uses 'isRead', others 'readAt'. Handle both.
                }
            } catch (err) {
                console.error("Failed to fetch notification history:", err);
            }
        };
        fetchHistory();

        // Initialize socket connection
        const newSocket = io(SOCKET_URL, {
            withCredentials: true
        });

        setSocket(newSocket);

        // Join user's private room
        newSocket.on("connect", () => {
            const roomId = currentUser.clinicId || currentUser.userId || currentUser._id;
            console.log(`📶 Global Socket Connected: ${newSocket.id} | Joining Room: ${roomId} | Role: ${currentUser.role}`);
            newSocket.emit("join_user_room", roomId);
        });


        // Listen for global notifications
        newSocket.on("notification", (data) => {
            console.log("🔔 Global Notification Received:", data);

            // Add to state
            setNotifications(prev => [data, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show premium toast
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-8 border-teal-500`}>
                    <div className="flex-1 w-0 p-5">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                                    <span className="text-xl">{data.type === 'APPOINTMENT' ? '📅' : '🔔'}</span>
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{data.title}</p>
                                <p className="mt-1 text-xs font-bold text-slate-500 leading-relaxed">{data.message}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-slate-100">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-[1.5rem] p-4 flex items-center justify-center text-xs font-black text-slate-400 hover:text-teal-600 focus:outline-none uppercase tracking-widest"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });
        });

        return () => {
            newSocket.close();
            console.log("🚫 Global Socket Closed");
        };
    }, [currentUser?._id, currentUser?.role]);

    const markRead = async (id) => {
        try {
            if (service?.markNotificationRead) {
                await service.markNotificationRead(id);
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, readAt: new Date(), isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error("Failed to mark read:", err);
        }
    };

    const markAllRead = async () => {
        try {
            if (service?.markAllNotificationsRead) {
                await service.markAllNotificationsRead();
                setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date(), isRead: true })));
                setUnreadCount(0);
            }
        } catch (err) {
            console.error("Failed to mark all read:", err);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, markRead, markAllRead }}>
            {children}
        </SocketContext.Provider>
    );
};
