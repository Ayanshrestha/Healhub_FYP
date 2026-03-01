import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, Calendar, Eye, Download, MessageSquare } from "lucide-react";
import ClinicalMessaging from "./ClinicalMessaging";

const AppointmentTable = ({ appointments = [], onStatusUpdate }) => {
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const getStatusStyle = (status) => {
        switch (status) {
            case "Confirmed": case "Approved": return "bg-blue-50 text-blue-600 border border-blue-100";
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Completed": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
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
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight w-fit ${getStatusStyle(appt.status)}`}>
                                                {appt.status}
                                            </span>
                                            {(appt.status === "Confirmed" || appt.status === "Approved" || appt.status === "Completed") && (
                                                <span className={`px-3 py-1 text-white rounded-lg text-[8px] font-black uppercase tracking-tighter w-fit shadow-sm ${appt.paymentStatus === 'Paid' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}`}>
                                                    {appt.paymentStatus === 'Paid' ? 'PAID' : 'UNPAID'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {appt.status === "Pending" && (
                                                <>
                                                    <button
                                                        onClick={() => onStatusUpdate(appt._id, "Confirmed")}
                                                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                                                        title="Confirm Appointment"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onStatusUpdate(appt._id, "Cancelled")}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Cancel Appointment"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {appt.status === "Confirmed" && (
                                                <button
                                                    onClick={() => onStatusUpdate(appt._id, "Completed")}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                                                    title="Mark as Completed"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={() => setSelectedAppointment(appt)}
                                                    className="relative p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                                                    title="Open Consultation Chat"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    {appt.unreadCount > 0 && (
                                                        <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedAppointment && (
                <ClinicalMessaging
                    appointmentId={selectedAppointment._id || selectedAppointment.id}
                    patientName={selectedAppointment.patientName}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}
        </div>
    );
};

export default AppointmentTable;
