import { Outlet } from "react-router-dom";
import ProviderNavbar from "../features/provider/components/ProviderNavbar";

const ProviderLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100 font-primary">
            <ProviderNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                <Outlet />
            </main>

            <footer className="bg-white/50 border-t border-gray-100 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-xs font-semibold">
                        © {new Date().getFullYear()} HealHub Healthcare Systems. Provider Portal.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ProviderLayout;
