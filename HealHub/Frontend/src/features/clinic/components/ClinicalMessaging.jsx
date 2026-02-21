import React, { useState, useEffect, useRef } from "react";
import { Send, FileText, Paperclip, X, Loader2 } from "lucide-react";
import clinicService from "../services/clinicService";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../services/api";

const ClinicalMessaging = ({ appointmentId, patientName, onClose }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const { socket } = useSocket();
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch Chat History
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await clinicService.getChatHistory(appointmentId);
                setMessages(history);
                // Mark as read when history is loaded
                await clinicService.markMessagesRead(appointmentId).catch(err => console.error("Mark read error:", err));
                // Dispatch event for local UI updates
                window.dispatchEvent(new CustomEvent('clinical_messages_read', { detail: { appointmentId } }));
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
                toast.error("Could not load message history");
            } finally {
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchHistory();
        }
    }, [appointmentId]);

    // Socket Integration
    useEffect(() => {
        if (socket && appointmentId) {
            socket.emit("join_room", appointmentId.toString());

            const handleNewMessage = (newMessage) => {
                if (newMessage.context === "CLINICAL") {
                    setMessages((prev) => {
                        // 1. Avoid duplicates by _id
                        if (prev.some(m => m._id === newMessage._id)) return prev;

                        // 2. Correlation by tempId
                        if (newMessage.tempId && prev.some(m => m.tempId === newMessage.tempId)) {
                            return prev.map(m => m.tempId === newMessage.tempId ? newMessage : m);
                        }

                        // 3. New message
                        return [...prev, newMessage];
                    });

                    // Automatically mark as read if viewing this chat
                    clinicService.markMessagesRead(appointmentId).catch(err => console.error("Mark read error:", err));
                    // Dispatch event for local UI updates
                    window.dispatchEvent(new CustomEvent('clinical_messages_read', { detail: { appointmentId } }));
                }
            };

            socket.on("new_message", handleNewMessage);

            return () => {
                socket.off("new_message", handleNewMessage);
            };
        }
    }, [socket, appointmentId]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!message.trim() && !attachment) || sending) return;

        setSending(true);
        const tempId = Date.now().toString();
        const sentContent = message; // Capture content

        // Optimistic update for text messages
        if (message.trim() && !attachment) {
            const optimisticMsg = {
                _id: tempId,
                tempId,
                content: message,
                sender: "CLINIC",
                createdAt: new Date().toISOString(),
                context: "CLINICAL",
                sending: true, // Custom flag for optimistic messages
                type: "TEXT",
                attachments: []
            };
            setMessages(prev => [...prev, optimisticMsg]);
            setMessage(""); // Clear input immediately
        }

        try {
            const messageData = {
                appointmentId,
                content: message || (attachment ? `Sent an attachment: ${attachment.name}` : "Patient report shared."),
                type: attachment ? "REPORT" : "TEXT",
                attachments: attachment ? [attachment] : [],
                context: "CLINICAL",
                tempId: message.trim() && !attachment ? tempId : undefined // Only send tempId for optimistic text messages
            };

            await clinicService.sendMessage(messageData);
            // If it was an attachment or not an optimistic text message, clear here
            if (attachment) {
                setMessage("");
                setAttachment(null);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error(error.message || "Failed to send message");
            // Revert optimistic update on error
            setMessages(prev => prev.filter(m => m.tempId !== tempId));
            // Restore message content if it was an optimistic text message
            if (sentContent.trim() && !attachment) {
                setMessage(sentContent);
            }
        } finally {
            setSending(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("attachment", file);

        try {
            const response = await clinicService.uploadFile(formData);
            setAttachment(response.data.data);
            toast.success("File uploaded successfully");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("File upload failed");
        } finally {
            setUploading(false);
        }
    };

    const requestReport = () => {
        setMessage("Please upload your latest lab reports here for my review. Thank you.");
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-[650px]">
                {/* Header */}
                <div className="bg-teal-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Send className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight">Clinical Messenger</h3>
                            <p className="text-[10px] font-bold text-teal-100 uppercase tracking-widest leading-none mt-0.5">Patient: {patientName}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={requestReport}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition"
                        >
                            Request Report
                        </button>
                        <button onClick={onClose} className="text-white/60 hover:text-white transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">Hydrating History...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <FileText className="w-8 h-8 text-gray-200" />
                            </div>
                            <div className="text-center px-8">
                                <p className="text-sm font-black text-gray-900">Clinical Channel Open</p>
                                <p className="text-xs font-bold text-gray-400 mt-1">Send follow-up instructions, share lab reports, or request updates from the patient.</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={msg._id || idx} className={`flex ${msg.sender === 'CLINIC' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.sender === 'CLINIC'
                                    ? 'bg-teal-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                                    }`}>
                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>

                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.attachments.map((at, i) => (
                                                <a
                                                    key={i}
                                                    href={`${BASE_URL}${at.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center space-x-2 p-2 rounded-xl border ${msg.sender === 'CLINIC'
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

                                    <p className={`text-[9px] mt-2 font-black uppercase tracking-tighter ${msg.sender === 'CLINIC' ? 'text-teal-200' : 'text-gray-400'
                                        }`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0">
                    <form onSubmit={handleSend} className="space-y-4">
                        {attachment && (
                            <div className="flex items-center justify-between p-3 bg-teal-50 border border-teal-100 rounded-2xl animate-slideUp">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-teal-900 uppercase tracking-tighter truncate max-w-[200px]">{attachment.name}</p>
                                        <p className="text-[9px] text-teal-600 font-bold uppercase">Ready to send</p>
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

                        <div className="relative group">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter follow-up instructions..."
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold min-h-[80px] focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                                required={!attachment}
                            />
                            <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                />
                                <button
                                    type="button"
                                    disabled={uploading}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-gray-400 hover:text-teal-600 transition disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={sending || uploading}
                            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm hover:bg-teal-700 transition shadow-lg shadow-teal-100 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Dispatching...</span>
                                </>
                            ) : (
                                <>
                                    <span>{attachment ? 'Send Report & Instructions' : 'Send Instructions'}</span>
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClinicalMessaging;
