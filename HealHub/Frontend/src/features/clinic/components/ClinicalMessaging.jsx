import React, { useState } from "react";
import { Send, FileText, Paperclip, X, CheckCircle2 } from "lucide-react";

const ClinicalMessaging = ({ patientName, onClose }) => {
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSent(true);
        setTimeout(onClose, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-teal-600 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Send className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-black text-white tracking-tight">Clinical Messenger</h3>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {!sent ? (
                        <form onSubmit={handleSend} className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Recipient</p>
                                <p className="text-lg font-bold text-gray-900">{patientName}</p>
                            </div>

                            <div className="relative">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Enter follow-up instructions or report summary..."
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold min-h-[120px] focus:ring-2 focus:ring-teal-500 transition-all"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-teal-50 rounded-2xl border border-teal-100 border-dashed">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <Paperclip className="w-5 h-5 text-teal-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-teal-800 uppercase tracking-tighter">Attach Lab Report</p>
                                    <p className="text-[10px] text-teal-600 font-bold">PDF, JPG up to 10MB</p>
                                </div>
                                <input type="file" className="hidden" id="report-upload" />
                                <label htmlFor="report-upload" className="cursor-pointer px-3 py-1 bg-white border border-teal-200 rounded-lg text-[10px] font-black text-teal-700 hover:bg-teal-100 transition">
                                    SELECT
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm hover:bg-teal-700 transition shadow-lg shadow-teal-100 flex items-center justify-center space-x-2"
                            >
                                <span>Send Instructions</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    ) : (
                        <div className="py-12 text-center space-y-4 animate-bounce">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <p className="text-xl font-black text-gray-900">Message Dispatched</p>
                            <p className="text-sm text-gray-500 font-bold tracking-tight">The follow-up has been securely sent to the patient portal.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClinicalMessaging;
