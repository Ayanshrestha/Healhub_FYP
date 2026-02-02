import { Outlet } from "react-router-dom";
import PatientNavbar from "../features/patient/components/PatientNavbar";

const PatientLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-primary">
            <PatientNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                <Outlet />
            </main>
            ...

            <footer className="bg-white border-t border-slate-100 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-500 text-xs font-semibold">
                        © {new Date().getFullYear()} HealHub Healthcare Systems. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PatientLayout;
