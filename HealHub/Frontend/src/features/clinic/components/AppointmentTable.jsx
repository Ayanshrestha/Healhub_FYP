import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, Calendar, Eye, Download, MessageSquare } from "lucide-react";
import ClinicalMessaging from "./ClinicalMessaging";

const AppointmentTable = ({ appointments = [] }) => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const getStatusStyle = (status) => {
        switch (status) {
            case "Confirmed": return "bg-teal-100 text-teal-700";
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Completed": return "bg-gray-100 text-gray-700";
            case "Cancelled": return "bg-red-100 text-red-700";
            default: return "bg-blue-100 text-blue-700";
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Appointments</h3>
                    <p className="text-sm text-gray-500 font-bold mt-1">Live patient booking overview</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                            <th className="py-4 px-6">Patient</th>
                            <th className="py-4 px-6">Specialist</th>
                            <th className="py-4 px-6">Date & Time</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-12 text-center">
                                    <Calendar className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                                    <p className="text-gray-400 font-bold">No appointments scheduled</p>
                                </td>
                            </tr>
                        ) : (
                            appointments.map((appt, idx) => (
                                <tr key={appt._id || idx} className="border-t border-gray-50 hover:bg-teal-50/30 transition-all duration-200">
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-bold text-gray-900">{appt.patientName}</p>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">Age: {appt.patientAge || "N/A"}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="font-bold text-gray-700">{appt.doctorName}</p>
                                        <p className="text-[10px] text-teal-600 font-black uppercase tracking-tight">{appt.specialization}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-1 font-bold text-gray-600">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{appt.dateTime}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${getStatusStyle(appt.status)}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => setSelectedPatient(appt.patientName)}
                                            className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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

export default AppointmentTable;
