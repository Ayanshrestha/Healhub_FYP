import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock, Calendar, Pill, Trash2, X, MessageCircle } from "lucide-react";
import { useSocket } from "../../../context/SocketContext";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = () => {
    const { notifications, unreadCount, markRead, markAllRead } = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getTypeIcon = (type) => {
        switch (type) {
            case "APPOINTMENT": return <Calendar className="w-4 h-4 text-emerald-500" />;
            case "MEDICINE": return <Pill className="w-4 h-4 text-teal-500" />;
            case "MESSAGE": return <MessageCircle className="w-4 h-4 text-blue-500" />;
            default: return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-2xl transition-all duration-300 ${isOpen ? "bg-teal-50 text-teal-600 ring-2 ring-teal-500/10" : "text-gray-500 hover:bg-gray-50 hover:text-teal-600"
                    }`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-teal-600 rounded-full text-[9px] text-white flex items-center justify-center font-black border-2 border-white shadow-sm animate-bounce-subtle">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden z-[100] animate-fadeIn">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest italic">Notifications</h4>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-teal-500 text-white text-[9px] font-black rounded-full uppercase">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-[9px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => !notif.readAt && markRead(notif._id)}
                                    className={`px-6 py-5 flex gap-4 cursor-pointer transition-all border-l-4 ${!notif.readAt
                                            ? "bg-teal-50/30 border-teal-500 hover:bg-teal-50"
                                            : "bg-white border-transparent grayscale-[0.3] opacity-70 hover:opacity-100 hover:grayscale-0"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!notif.readAt ? "bg-white shadow-sm" : "bg-slate-50"
                                        }`}>
                                        {getTypeIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={`text-xs font-black uppercase tracking-tight truncate pr-4 ${!notif.readAt ? "text-slate-800" : "text-slate-500"}`}>
                                                {notif.title}
                                            </p>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase whitespace-nowrap">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className={`text-[11px] leading-relaxed line-clamp-2 ${!notif.readAt ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                                            {notif.message}
                                        </p>
                                    </div>
                                    {!notif.readAt && (
                                        <div className="w-2 h-2 rounded-full bg-teal-500 mt-1 shadow-sm shadow-teal-500/20"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center px-10">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-100">
                                    <Bell className="w-6 h-6 text-slate-200" />
                                </div>
                                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Quiet in here...</h5>
                                <p className="text-[10px] text-slate-300 mt-2 font-medium">You're all caught up with your updates.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-50/50 border-t border-slate-50">
                        <button className="w-full py-2.5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors">
                            View All Activity
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
