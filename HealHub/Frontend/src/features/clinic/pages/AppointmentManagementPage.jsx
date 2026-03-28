import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import AppointmentTable from "../components/AppointmentTable";
import clinicService from "../services/clinicService";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const AppointmentManagementPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await clinicService.getAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();

        const handleRead = (e) => {
            const { appointmentId } = e.detail;
            console.log(`🧹 Clearing unread badge for appointment: ${appointmentId}`);
            setAppointments(prev => prev.map(appt =>
                appt._id === appointmentId ? { ...appt, unreadCount: 0 } : appt
            ));
        };

        window.addEventListener('clinical_messages_read', handleRead);
        return () => window.removeEventListener('clinical_messages_read', handleRead);
    }, []);

    const handleStatusUpdate = async (appointmentId, status) => {
        try {
            await clinicService.updateAppointmentStatus(appointmentId, status);
            toast.success(`Appointment status updated to ${status.toLowerCase()}`);
            fetchAppointments(); // Refresh list
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <ClinicLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resource Scheduling</h1>
                        <p className="text-gray-500 font-bold mt-1">Full overview of all patient-doctor interactions.</p>
                    </div>
                    {loading && <Loader2 className="w-6 h-6 animate-spin text-teal-600" />}
                </div>

                <AppointmentTable
                    appointments={appointments}
                    onStatusUpdate={handleStatusUpdate}
                />
            </div>
        </ClinicLayout>
    );
};

export default AppointmentManagementPage;
