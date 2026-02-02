import React from "react";
import { Building, Loader2, Eye } from "lucide-react";

const ClinicApprovalPanel = ({ loading, pendingClinics, doctorOversight, setSelectedClinic, handleClinicAction }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Healthcare Governance</h3>
                <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold ring-1 ring-teal-100">{pendingClinics.length} New Clinics</span>
                </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-teal-600" /></div>
                ) : [...pendingClinics, ...doctorOversight].length === 0 ? (
                    <p className="text-gray-400 text-center p-4">No pending oversight actions</p>
                ) : (
                    <>
                        {pendingClinics.map((clinic, idx) => (
                            <div key={clinic._id || `c-${idx}`} className="p-4 rounded-2xl border-2 border-amber-100 bg-amber-50/30 transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">
                                            <Building className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{clinic.clinicName}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Clinic Registration</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase">Action Req.</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedClinic(clinic)}
                                        className="flex-1 py-2 bg-white text-teal-600 border border-teal-200 rounded-xl text-xs font-bold hover:bg-teal-50 transition-all shadow-sm"
                                    >
                                        Review
                                    </button>
                                    <button
                                        onClick={() => handleClinicAction(clinic._id, "APPROVED_UNPAID")}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                        {doctorOversight.map((doc, idx) => (
                            <div key={doc._id || `d-${idx}`} className="p-4 rounded-2xl border border-gray-100 bg-white transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold">
                                            {(doc.fullName || "?")[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{doc.fullName}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Doctor • {doc.verificationStatus}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClinicApprovalPanel;
