import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
    Send,
    Paperclip,
    MoreVertical,
    ArrowLeft,
    Phone,
    Video,
    ShieldCheck,
    Loader2,
    Calendar,
    Clock,
    FileText,
    CheckCircle2,
    Check
} from "lucide-react";
import io from "socket.io-client";
import patientService from "../services/patientService";
import { BASE_URL, SOCKET_URL } from "../../../services/api";

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

const PatientMessages = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [messages, setMessages] = useState([]);
    const [appointment, setAppointment] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [activeContext, setActiveContext] = useState(searchParams.get("context") || "DIRECT"); // DIRECT or CLINICAL
    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        const initChat = async () => {
            try {
                const [appDetails, msgData] = await Promise.all([
                    patientService.getAppointmentDetails(appointmentId),
                    patientService.getMessages(appointmentId, activeContext)
                ]);
                setAppointment(appDetails);
                setMessages(Array.isArray(msgData) ? msgData : []);

                // Socket setup
                socket.current = io(SOCKET_URL);
                socket.current.emit("join_chat", appointmentId.toString());

                socket.current.on("new_message", (msg) => {
                    if (msg.appointmentId.toString() === appointmentId.toString() && msg.context === activeContext) {
                        setMessages(prev => {
                            // 1. Check if we already have this message by _id
                            if (prev.some(m => m._id === msg._id)) return prev;

                            // 2. Check if we have an optimistic message for this tempId
                            if (msg.tempId && prev.some(m => m.tempId === msg.tempId)) {
                                return prev.map(m => m.tempId === msg.tempId ? msg : m);
                            }

                            // 3. Otherwise add it
                            return [...prev, msg];
                        });
                        // Automatically mark as read if viewing
                        patientService.markMessagesRead(appointmentId, activeContext);
                    }
                });

                // Initial mark as read
                patientService.markMessagesRead(appointmentId, activeContext);
            } catch (error) {
                console.error("Chat init error:", error);
            } finally {
                setLoading(false);
            }
        };

        initChat();

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, [appointmentId, activeContext]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleContextChange = (newContext) => {
        setActiveContext(newContext);
        setSearchParams({ context: newContext });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const tempId = Date.now().toString();
        const optimisticMsg = {
            _id: tempId,
            tempId,
            content: newMessage,
            sender: "PATIENT",
            createdAt: new Date().toISOString(),
            context: activeContext,
            sending: true
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");

        try {
            await patientService.sendMessage(appointmentId, newMessage, "TEXT", [], activeContext, tempId);
            // The socket will replace the optimistic message.
        } catch (error) {
            console.error("Send error:", error);
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m._id !== tempId));
            setNewMessage(optimisticMsg.content);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-50 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <button onClick={() => navigate("/patient/appointments")} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all"><ArrowLeft className="w-5 h-5" /></button>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                            <img
                                src={activeContext === "DIRECT"
                                    ? (appointment.providerId?.profilePhoto || `https://ui-avatars.com/api/?name=${appointment.providerId?.fullName}&background=0D9488&color=fff`)
                                    : (appointment.clinicId?.logo || `https://ui-avatars.com/api/?name=${appointment.clinicId?.clinicName}&background=0F172A&color=fff`)}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-800 tracking-tight uppercase italic">
                                    {activeContext === "DIRECT" ? appointment.providerId?.fullName : appointment.clinicId?.clinicName}
                                </h4>
                                <ShieldCheck className="w-4 h-4 text-teal-500 fill-teal-500/10" />
                            </div>
                            <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest">
                                {activeContext === "DIRECT"
                                    ? (appointment.providerId?.specialization || "General Physician")
                                    : "Clinical Administration"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex bg-slate-50 p-1 rounded-xl">
                        <button
                            onClick={() => handleContextChange("DIRECT")}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeContext === "DIRECT" ? "bg-white text-teal-600 shadow-sm" : "text-slate-400 opacity-60 hover:opacity-100"}`}
                        >
                            Doctor
                        </button>
                        <button
                            onClick={() => handleContextChange("CLINICAL")}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeContext === "CLINICAL" ? "bg-white text-teal-600 shadow-sm" : "text-slate-400 opacity-60 hover:opacity-100"}`}
                        >
                            Clinic
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointment Context Strip */}
            <div className="bg-slate-50 px-8 py-3 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2 text-teal-500" /> {new Date(appointment.appointmentDate).toLocaleDateString()}</div>
                    <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-2 text-teal-500" /> {appointment.timeSlot}</div>
                </div>
                <div className="flex items-center bg-white px-3 py-1 rounded-lg border border-slate-100 text-teal-600">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                    Confirmed Session
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fdfdfd]">
                <div className="text-center py-10">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm"><ShieldCheck className="w-8 h-8 text-teal-500" /></div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest max-w-xs mx-auto">This conversation is encrypted. Healthcare professionals are available for your assistance.</p>
                </div>

                {Object.entries(groupMessagesByDate(messages)).map(([date, group]) => (
                    <div key={date} className="space-y-8">
                        <div className="flex items-center justify-center my-10">
                            <div className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border border-white shadow-sm">
                                {date}
                            </div>
                        </div>
                        {group.map((msg, i) => {
                            const isPatient = msg.sender === "PATIENT";
                            return (
                                <div key={msg._id || i} className={`flex ${isPatient ? "justify-end" : "justify-start"} animate-fadeIn`}>
                                    <div className={`max-w-[70%] group`}>
                                        <div className={`
                                            p-5 rounded-[2rem] font-medium text-[15px] leading-relaxed relative
                                            ${isPatient
                                                ? "bg-slate-900 text-white shadow-xl shadow-slate-200/50 rounded-tr-none"
                                                : "bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none"
                                            }
                                        `}>
                                            {msg.content}

                                            {/* Attachments */}
                                            {msg.attachments?.map((att, index) => (
                                                <a
                                                    key={index}
                                                    href={`${BASE_URL}${att.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`mt-4 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] ${isPatient ? "bg-white/10 text-white" : "bg-slate-50 text-slate-700 hover:bg-teal-50"}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPatient ? "bg-white/20" : "bg-teal-100 text-teal-600"}`}>
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden text-left">
                                                        <p className="text-xs font-black uppercase tracking-wider truncate">{att.name}</p>
                                                        <p className="text-[10px] opacity-60">Medical Document</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                        <div className={`mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isPatient ? "justify-end text-slate-300" : "justify-start text-slate-400"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {isPatient && (
                                                msg.sending ? <Loader2 className="w-3 h-3 animate-spin text-teal-500" /> :
                                                    msg.readAt ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Check className="w-3 h-3" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="px-8 py-6 border-t border-slate-50 bg-white shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.05)]">
                <div className="bg-slate-50 rounded-[2rem] p-2 flex items-center border border-slate-100 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-500/30 transition-all">
                    <button type="button" className="p-4 text-slate-400 hover:text-teal-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={activeContext === "DIRECT" ? "Type your health query to doctor..." : "Response to clinic instructions..."}
                        className="flex-1 bg-transparent border-none outline-none px-2 font-medium text-slate-700 placeholder:text-slate-400"
                    />
                    <button
                        disabled={!newMessage.trim() || sending}
                        className="p-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-teal-600 disabled:opacity-20 transition-all shadow-lg shadow-slate-200"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientMessages;
