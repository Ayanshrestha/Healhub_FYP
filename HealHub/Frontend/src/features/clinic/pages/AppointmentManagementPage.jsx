import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import AppointmentTable from "../components/AppointmentTable";
import clinicService from "../services/clinicService";
import { Loader2 } from "lucide-react";

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
    }, []);

    const handleStatusUpdate = async (appointmentId, status) => {
        try {
            await clinicService.updateAppointmentStatus(appointmentId, status);
            fetchAppointments(); // Refresh list
        } catch (error) {
            alert("Failed to update status");
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
