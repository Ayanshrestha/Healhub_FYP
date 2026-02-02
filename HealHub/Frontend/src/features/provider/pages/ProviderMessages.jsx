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
    MessageSquare
} from "lucide-react";
import * as providerService from "../services/providerService";

const ProviderMessages = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                // We use appointments to get the list of patients the provider has interacted with
                const res = await providerService.getAppointments();

                // Extract unique patients
                const uniquePatients = [];
                const patientIds = new Set();

                (res.appointments || []).forEach(appt => {
                    if (appt.patientId && !patientIds.has(appt.patientId._id)) {
                        patientIds.add(appt.patientId._id);
                        uniquePatients.push({
                            ...appt.patientId,
                            lastMessage: "Click to start conversation",
                            lastTime: new Date(appt.appointmentDate).toLocaleDateString(),
                            status: appt.status
                        });
                    }
                });

                setPatients(uniquePatients);
                if (uniquePatients.length > 0) setSelectedPatient(uniquePatients[0]);
            } catch (err) {
                console.error("Fetch patients error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            const fetchChatHistory = async () => {
                try {
                    setChatLoading(true);
                    // In a real app, we'd fetch by patient ID. Here we use the service's mock history.
                    const res = await providerService.getMessageHistory(selectedPatient._id);
                    setMessages(res.messages || []);
                } catch (err) {
                    console.error("Fetch chat history error:", err);
                } finally {
                    setChatLoading(false);
                }
            };
            fetchChatHistory();
        }
    }, [selectedPatient]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPatient) return;

        const msgData = {
            receiverId: selectedPatient._id,
            content: newMessage,
            senderRole: 'provider'
        };

        // UI Optimistic Update
        const optimisticMsg = {
            _id: Date.now().toString(),
            senderId: 'me',
            content: newMessage,
            createdAt: new Date().toISOString(),
            status: 'sent'
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");

        try {
            await providerService.sendMessage(msgData);
            // In a real socket environment, we'd wait for ack. 
            // For now, we'll mark it as 'delivered' after a brief delay
            setTimeout(() => {
                setMessages(prev => prev.map(m => m._id === optimisticMsg._id ? { ...m, status: 'delivered' } : m));
            }, 1000);
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                        <button
                            key={patient._id}
                            onClick={() => setSelectedPatient(patient)}
                            className={`w-full p-4 rounded-3xl flex items-center space-x-3 transition-all ${selectedPatient?._id === patient._id
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 scale-[1.02]'
                                : 'bg-white hover:bg-teal-50/50 text-gray-900'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm ${selectedPatient?._id === patient._id ? 'bg-white/20' : 'bg-teal-100 text-teal-600'
                                }`}>
                                {patient.fullName?.charAt(0)}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-sm truncate">{patient.fullName}</p>
                                <p className={`text-[10px] font-bold truncate ${selectedPatient?._id === patient._id ? 'text-teal-100' : 'text-gray-400 italic'}`}>
                                    {patient.lastMessage}
                                </p>
                            </div>
                            <div className="text-[8px] font-black uppercase flex flex-col items-end space-y-1">
                                <span className={selectedPatient?._id === patient._id ? 'text-teal-200' : 'text-gray-300'}>{patient.lastTime}</span>
                                {patient.status === 'Pending' && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>}
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
                {selectedPatient ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 text-sm font-black border border-teal-100 shadow-sm">
                                    {selectedPatient.fullName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 leading-none mb-1">{selectedPatient.fullName}</h3>
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
                                messages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                    >
                                        <div className={`max-w-[70%] space-y-1`}>
                                            <div className={`p-4 rounded-[1.5rem] font-bold text-sm shadow-sm ${msg.senderId === 'me'
                                                ? 'bg-teal-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-50 rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <div className={`flex items-center space-x-1.5 px-2 ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {msg.senderId === 'me' && (
                                                    msg.status === 'delivered'
                                                        ? <CheckCheck className="w-3 h-3 text-teal-400" />
                                                        : <Check className="w-3 h-3 text-gray-200" />
                                                )}
                                            </div>
                                        </div>
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
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                                <button type="button" className="p-3 text-gray-400 hover:text-teal-600 transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Type medical instructions..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-teal-600 transition-all outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-3.5 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-gray-200"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
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
