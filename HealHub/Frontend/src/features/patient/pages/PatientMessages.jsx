import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const PatientMessages = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [appointment, setAppointment] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        const initChat = async () => {
            try {
                const [appDetails, msgData] = await Promise.all([
                    patientService.getAppointmentDetails(appointmentId),
                    patientService.getMessages(appointmentId)
                ]);
                setAppointment(appDetails);
                setMessages(Array.isArray(msgData) ? msgData : []);

                // Socket setup
                socket.current = io("http://localhost:5000");
                socket.current.emit("join_appointment_room", appointmentId);

                socket.current.on("receive_message", (msg) => {
                    if (msg.appointmentId === appointmentId) {
                        setMessages(prev => [...prev, msg]);
                    }
                });
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
    }, [appointmentId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const msg = await patientService.sendMessage(appointmentId, newMessage);
            // Socket will handle the update if backend emits to sender, but usually we add local opt and socket handles broadcast
            // setMessages(prev => [...prev, msg]); // Backend usually emits back
            setNewMessage("");
        } catch (error) {
            console.error("Send error:", error);
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
                            <img src={appointment.doctorId?.profilePhoto || `https://ui-avatars.com/api/?name=${appointment.doctorId?.fullName}&background=0D9488&color=fff`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-800 tracking-tight uppercase italic">{appointment.doctorId?.fullName}</h4>
                                <ShieldCheck className="w-4 h-4 text-teal-500 fill-teal-500/10" />
                            </div>
                            <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest">{appointment.doctorId?.specialization || "General Physician"}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-teal-50 hover:text-teal-600 transition-all"><Phone className="w-5 h-5" /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-teal-50 hover:text-teal-600 transition-all"><Video className="w-5 h-5" /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all"><MoreVertical className="w-5 h-5" /></button>
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

                {messages.map((msg, i) => {
                    const isPatient = msg.senderType === "patient" || msg.senderType === "Patient";
                    return (
                        <div key={i} className={`flex ${isPatient ? "justify-end" : "justify-start"}`}>
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
                                        <div key={index} className={`mt-4 p-4 rounded-2xl flex items-center gap-4 ${isPatient ? "bg-white/10" : "bg-slate-50"}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPatient ? "bg-white/20" : "bg-teal-100 text-teal-600"}`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-xs font-black uppercase tracking-wider truncate">{att.originalName}</p>
                                                <p className="text-[10px] opacity-60">Medical Document</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={`mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isPatient ? "justify-end text-slate-300" : "justify-start text-slate-400"}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isPatient && (
                                        msg.readStatus ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Check className="w-3 h-3" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
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
                        placeholder="Type your health query here..."
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
