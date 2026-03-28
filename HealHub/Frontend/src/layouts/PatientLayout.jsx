import { Outlet } from "react-router-dom";
import PatientNavbar from "../features/patient/components/PatientNavbar";

const PatientLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-primary flex flex-col">
            <PatientNavbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fadeIn">
                <Outlet />
            </main>
        </div>
    );
};

export default PatientLayout;
