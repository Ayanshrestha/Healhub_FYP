import React, { useState } from "react";
import { User, Search, Filter, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import ClinicalMessaging from "./ClinicalMessaging";

const PatientList = ({ patients = [] }) => {
    const [selectedPatient, setSelectedPatient] = useState(null);
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
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-500 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-gray-50 text-gray-500 hover:text-teal-600 rounded-xl transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <User className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                        <p className="text-gray-400 font-bold">No registered patients found</p>
                    </div>
                ) : (
                    patients.map((patient, idx) => (
                        <div
                            key={patient._id || idx}
                            className="p-5 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black shadow-inner group-hover:scale-110 transition-transform">
                                    {patient.name?.[0].toUpperCase() || "P"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-tight">{patient.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">ID: {patient.patientId || "N/A"}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-teal-500" />
                                    <span>Age: {patient.age} • {patient.gender}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
                                    <Phone className="w-3.5 h-3.5 text-teal-500" />
                                    <span>{patient.phone}</span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
                                <button className="text-[10px] font-black uppercase text-teal-600 hover:text-teal-700 tracking-widest">
                                    View Appts
                                </button>
                                <button
                                    onClick={() => setSelectedPatient(patient.name)}
                                    className="p-2 bg-gray-50 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedPatient && (
                <ClinicalMessaging
                    patientName={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                />
            )}
        </div>
    );
};

export default PatientList;
