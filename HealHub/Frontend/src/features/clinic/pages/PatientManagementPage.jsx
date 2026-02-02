import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import PatientList from "../components/PatientList";
import clinicService from "../services/clinicService";
import { Loader2 } from "lucide-react";

const PatientManagementPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await clinicService.getPatients();
            setPatients(data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <ClinicLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Patient Directory</h1>
                        <p className="text-gray-500 font-bold mt-1">Manage and view histories of patients who visited your facility.</p>
                    </div>
                    {loading && <Loader2 className="w-6 h-6 animate-spin text-teal-600" />}
                </div>

                <PatientList patients={patients} />
            </div>
        </ClinicLayout>
    );
};

export default PatientManagementPage;
