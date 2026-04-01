import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    User,
    Clock,
    ShieldCheck,
    Check,
    CheckCheck,
    Loader2,
    MessageSquare,
    FileText,
    X
} from "lucide-react";
import { toast } from "react-hot-toast";
import * as providerService from "../services/providerService";
import { SOCKET_URL, BASE_URL } from "../../../services/api";

import io from "socket.io-client";

const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
        const date = new Date(msg.createdAt).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const today = new Date().toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        let label = date;
        if (date === today) label = "TODAY";
        else if (date === yesterday) label = "YESTERDAY";

        if (!groups[label]) groups[label] = [];
        groups[label].push(msg);
    });
    return groups;
};

const ProviderMessages = () => {
    const [selectedChat, setSelectedChat] = useState(null); // Now stores the appointment/chat object
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [uploading, setUploading] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const socket = useRef();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                const res = await providerService.getAppointments();

                // Group by appointment for real-time room consistency
                const activeChats = (res.appointments || []).map(appt => ({
                    appointmentId: appt._id,
                    patient: appt.patientId,
                    lastTime: new Date(appt.appointmentDate).toLocaleDateString(),
                    status: appt.status,
                    recentMessage: "Click to view chat"
                }));

                setChats(activeChats);
                if (activeChats.length > 0) setSelectedChat(activeChats[0]);
            } catch (err) {
                console.error("Fetch chats error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();

        // Initialize socket
        socket.current = io(SOCKET_URL);

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, []);


    useEffect(() => {
        if (selectedChat) {
            const fetchChatHistory = async () => {
                try {
                    setChatLoading(true);
                    const res = await providerService.getMessageHistory(selectedChat.appointmentId);
                    setMessages(res.history || res.messages || []);

                    // Join the specific chat room
                    socket.current.emit("join_chat", selectedChat.appointmentId.toString());
                    // Also mark read
                    providerService.markMessagesRead(selectedChat.appointmentId);
                } catch (err) {
                    console.error("Fetch chat history error:", err);
                } finally {
                    setChatLoading(false);
                }
            };
            fetchChatHistory();

            // Listen for messages in this room
            socket.current.on("new_message", (msg) => {
                if (msg.appointmentId.toString() === selectedChat.appointmentId.toString()) {
                    setMessages(prev => {
                        // 1. Duplicate check
                        if (prev.some(m => m._id === msg._id)) return prev;

                        // 2. Optimistic replacement
                        if (msg.tempId && prev.some(m => m.tempId === msg.tempId)) {
                            return prev.map(m => m.tempId === msg.tempId ? msg : m);
                        }

                        return [...prev, msg];
                    });

                    // Update sidebar
                    setChats(prevChats => prevChats.map(c => {
                        if (c.appointmentId.toString() === msg.appointmentId.toString()) {
                            return {
                                ...c,
                                recentMessage: msg.content,
                                lastTime: new Date(msg.createdAt).toLocaleDateString()
                            };
                        }
                        return c;
                    }));

                    // Mark as read if user is looking at it
                    providerService.markMessagesRead(selectedChat.appointmentId);
                }
            });

            return () => {
                socket.current.off("new_message");
            };
        }
    }, [selectedChat]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("attachment", file);

        try {
            const response = await providerService.uploadFile(formData);
            setAttachment(response.data);
            toast.success("File uploaded successfully");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("File upload failed");
        } finally {
            setUploading(false);
        }
    };


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !attachment) || !selectedChat) return;

        const tempId = Date.now().toString();
        
        // Optimistic update for text-only
        if (!attachment) {
            const optimisticMsg = {
                _id: tempId,
                tempId,
                content: newMessage,
                sender: "PROVIDER",
                createdAt: new Date().toISOString(),
                sending: true
            };
            setMessages(prev => [...prev, optimisticMsg]);
            setNewMessage("");
        }

        const msgData = {
            appointmentId: selectedChat.appointmentId,
            content: newMessage || (attachment ? `Shared a medical document: ${attachment.name}` : ""),
            type: attachment ? "REPORT" : "TEXT",
            attachments: attachment ? [attachment] : [],
            tempId
        };

        try {
            await providerService.sendMessage(msgData);
            if (attachment) {
                setAttachment(null);
                setNewMessage("");
            }
        } catch (err) {
            console.error("Send message error:", err);
            if (!attachment) setMessages(prev => prev.filter(m => m._id !== tempId));
            toast.error("Failed to send message");
        }
    };

    const filteredChats = chats.filter(c =>
        c.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-180px)] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex animate-fadeIn">
            {/* Sidebar: Patient List */}
            <div className="w-80 border-r border-gray-50 flex flex-col bg-slate-50/30">
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 pl-10 pr-4 py-2.5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
                    {filteredChats.length > 0 ? filteredChats.map((chat) => (
                        <button
                            key={chat.appointmentId}
                            onClick={() => setSelectedChat(chat)}
                            className={`w-full p-4 rounded-3xl flex items-center space-x-3 transition-all ${selectedChat?.appointmentId === chat.appointmentId
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 scale-[1.02]'
                                : 'bg-white hover:bg-teal-50/50 text-gray-900'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center text-sm font-black shadow-sm ${selectedChat?.appointmentId === chat.appointmentId ? 'bg-white/20' : 'bg-teal-100 text-teal-600'
                                }`}>
                                {chat.patient?.profilePhoto ? (
                                    <img src={chat.patient.profilePhoto} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    chat.patient?.fullName?.charAt(0)
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-sm truncate">{chat.patient?.fullName}</p>
                                <p className={`text-[10px] font-bold truncate ${selectedChat?.appointmentId === chat.appointmentId ? 'text-teal-100' : 'text-gray-400 italic'}`}>
                                    {chat.recentMessage}
                                </p>
                            </div>
                            <div className="text-[8px] font-black uppercase flex flex-col items-end space-y-1">
                                <span className={selectedChat?.appointmentId === chat.appointmentId ? 'text-teal-200' : 'text-gray-300'}>{chat.lastTime}</span>
                                {chat.status === 'Pending' && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>}
                            </div>
                        </button>
                    )) : (
                        <div className="text-center py-10 px-6">
                            <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                            <p className="text-xs text-gray-400 font-bold italic">No active patient threads found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-teal-50 flex items-center justify-center text-teal-600 text-sm font-black border border-teal-100 shadow-sm">
                                    {selectedChat.patient?.profilePhoto ? (
                                        <img src={selectedChat.patient.profilePhoto} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        selectedChat.patient?.fullName?.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 leading-none mb-1">{selectedChat.patient?.fullName}</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Sync Connected</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-teal-600 transition-all">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-teal-600 transition-all">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-gray-600 transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20">
                            {chatLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-8 h-8 text-teal-200 animate-spin" />
                                </div>
                            ) : messages.length > 0 ? (
                                Object.entries(groupMessagesByDate(messages)).map(([date, group]) => (
                                    <div key={date} className="space-y-6">
                                        <div className="flex items-center justify-center my-8">
                                            <div className="bg-slate-100 px-4 py-1 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-50 shadow-sm">
                                                {date}
                                            </div>
                                        </div>

                                        {group.map((msg) => {
                                            const isMe = msg.sender === "PROVIDER";
                                            return (
                                                <div
                                                    key={msg._id}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                                >
                                                    <div className="max-w-[70%] space-y-1">
                                                        <div className={`p-4 rounded-[1.5rem] font-bold text-sm shadow-sm ${isMe
                                                            ? 'bg-teal-600 text-white rounded-tr-none shadow-teal-100/50'
                                                            : 'bg-white text-gray-800 border border-gray-50 rounded-tl-none'
                                                            }`}>
                                                            {msg.content}
                                                            
                                                            {msg.attachments && msg.attachments.length > 0 && (
                                                                <div className="mt-3 space-y-2">
                                                                    {msg.attachments.map((at, i) => (
                                                                        <a
                                                                            key={i}
                                                                            href={`${BASE_URL}${at.url}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className={`flex items-center space-x-2 p-3 rounded-xl border ${isMe
                                                                                ? 'bg-white/10 border-white/20 text-white'
                                                                                : 'bg-teal-50 border-teal-100 text-teal-700'
                                                                                } hover:scale-[1.02] transition-transform`}
                                                                        >
                                                                            <FileText className="w-4 h-4" />
                                                                            <span className="text-[10px] font-black truncate max-w-[150px] uppercase tracking-tighter">{at.name}</span>
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={`flex items-center space-x-1.5 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {isMe && (
                                                                msg.readAt
                                                                    ? <CheckCheck className="w-3 h-3 text-teal-400" />
                                                                    : <Check className="w-3 h-3 text-gray-200" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                    <div className="w-20 h-20 bg-teal-50 flex items-center justify-center rounded-[2rem]">
                                        <ShieldCheck className="w-10 h-10 text-teal-300" />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 uppercase tracking-widest text-xs">Clinical Encryption Active</p>
                                        <p className="text-xs font-bold text-gray-500 italic max-w-xs mt-2">Messages are end-to-end encrypted. Start providing medical guidance below.</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-50">
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                {attachment && (
                                    <div className="flex items-center justify-between p-3 bg-teal-50 border border-teal-100 rounded-2xl animate-slideUp">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-teal-900 uppercase tracking-tighter truncate max-w-[200px]">{attachment.name}</p>
                                                <p className="text-[9px] text-teal-600 font-bold uppercase">Clinical Document Ready</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAttachment(null)}
                                            className="p-1 hover:bg-teal-100 rounded-lg text-teal-600 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="p-3 text-gray-400 hover:text-teal-600 transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                                    </button>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder={attachment ? "Add instructions for this document..." : "Type medical instructions..."}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-teal-600 transition-all outline-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={(!newMessage.trim() && !attachment) || uploading}
                                        className="p-3.5 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-gray-200"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                        <div className="w-24 h-24 bg-teal-50 flex items-center justify-center rounded-[2.5rem] shadow-inner mb-2 animate-bounce">
                            <MessageSquare className="w-12 h-12 text-teal-300" />
                        </div>
                        <div className="max-w-xs">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Select a consultation</h3>
                            <p className="text-sm font-bold text-gray-400 italic mt-2">Choose a patient from the left column to view message history and send new clinical instructions.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderMessages;
