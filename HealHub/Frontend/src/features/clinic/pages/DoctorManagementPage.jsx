import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import DoctorManagement from "../components/DoctorManagement";
import clinicService from "../services/clinicService";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const DoctorManagementPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [applications, setApplications] = useState([]);
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [doctorsData, applicationsData, availableData] = await Promise.all([
                clinicService.getDoctors(),
                clinicService.getAffiliationApplications(),
                clinicService.getAvailableDoctors()
            ]);
            setDoctors(doctorsData);
            setApplications(applicationsData);
            setAvailableDoctors(availableData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAffiliationAction = async (affiliationId, status) => {
        try {
            await clinicService.handleAffiliation(affiliationId, status);
            toast.success(`Request ${status.toLowerCase()} successfully`);
            fetchData(); // Refresh all lists
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update affiliation status");
        }
    };

    const handleInvite = async (doctorId) => {
        try {
            await clinicService.inviteDoctor(doctorId);
            toast.success("Invitation sent successfully!");
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send invitation");
        }
    };

    const handleRemove = async (doctorId) => {
        if (!window.confirm("Are you sure you want to remove this doctor?")) return;
        try {
            await clinicService.removeDoctor(doctorId);
            toast.success("Doctor removed from affiliation");
            fetchData();
        } catch (error) {
            toast.error("Failed to remove doctor");
        }
    };

    return (
        <ClinicLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Staffing & Affiliations</h1>
                        <p className="text-gray-500 font-bold mt-1">Manage healthcare professionals affiliated with your facility.</p>
                    </div>
                    {loading && <Loader2 className="w-6 h-6 animate-spin text-teal-600" />}
                </div>

                <DoctorManagement
                    doctors={doctors}
                    applications={applications}
                    availableDoctors={availableDoctors}
                    onAffiliationAction={handleAffiliationAction}
                    onInvite={handleInvite}
                    onRemove={handleRemove}
                />
            </div>
        </ClinicLayout>
    );
};

export default DoctorManagementPage;
