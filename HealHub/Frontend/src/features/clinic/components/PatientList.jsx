import React, { useState } from "react";
import { User, Search, Filter, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import ClinicalMessaging from "./ClinicalMessaging";

const PatientList = ({ patients = [] }) => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const filteredPatients = patients.filter(p =>
        p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm)
    );

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Patient Directory</h3>
                    <p className="text-sm text-gray-500 font-bold mt-1">Management of registered facility patients</p>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-500 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-gray-50 text-gray-500 hover:text-teal-600 rounded-xl transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <User className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                        <p className="text-gray-400 font-bold">No registered patients found</p>
                    </div>
                ) : (
                    filteredPatients.map((patient, idx) => (
                        <div
                            key={patient._id || idx}
                            className="p-5 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black shadow-inner group-hover:scale-110 transition-transform">
                                    {(patient.fullName || "P")[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 leading-tight truncate">{patient.fullName}</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5 truncate">ID: {patient._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-teal-500" />
                                    <span>Age: {calculateAge(patient.dob)} • {patient.gender}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
                                    <Phone className="w-3.5 h-3.5 text-teal-500" />
                                    <span>{patient.phone}</span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
                                <button className="text-[10px] font-black uppercase text-teal-600 hover:text-teal-700 tracking-widest">
                                    View History
                                </button>
                                <button
                                    onClick={() => setSelectedPatient({ id: patient.latestAppointmentId, name: patient.fullName })}
                                    className="relative p-2 bg-gray-50 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                    disabled={!patient.latestAppointmentId}
                                    title={!patient.latestAppointmentId ? "No appointment context available" : "Open Consultation Chat"}
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    {patient.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedPatient && (
                <ClinicalMessaging
                    appointmentId={selectedPatient.id}
                    patientName={selectedPatient.name}
                    onClose={() => setSelectedPatient(null)}
                />
            )}
        </div>
    );
};

export default PatientList;
