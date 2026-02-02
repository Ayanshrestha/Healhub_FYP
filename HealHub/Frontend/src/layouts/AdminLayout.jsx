import AdminNavbar from "../features/admin/components/AdminNavbar";
import AdminTopNavbar from "../features/admin/components/AdminTopNavbar";

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <AdminNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                {children}
            </main>

            <footer className="bg-white/50 border-t border-gray-100 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
                        HealHub Administration Terminal © {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;
