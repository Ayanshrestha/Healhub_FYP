import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { FaUsers, FaUserMd, FaHospital, FaCalendarCheck } from "react-icons/fa";

const StatCard = ({ title, count, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition cursor-default">
        <div className={`p-4 rounded-xl ${color} text-white mr-5 shadow-inner`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{count}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">System Overview</h1>
                <p className="text-gray-500 mt-2">Welcome to the HealHub Admin Control Panel.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Patients"
                    count="1,284"
                    icon={<FaUsers size={24} />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Doctors"
                    count="412"
                    icon={<FaUserMd size={24} />}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Clinics Joined"
                    count="87"
                    icon={<FaHospital size={24} />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Appointments"
                    count="3,562"
                    icon={<FaCalendarCheck size={24} />}
                    color="bg-amber-500"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg">System Audit Log</h3>
                    <button className="text-emerald-700 text-sm font-bold hover:underline">View All Logs</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Event Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { event: "System Backup Initiated", cat: "Infrastructure", time: "10 mins ago", status: "Completed", color: "text-emerald-600 bg-emerald-50" },
                                { event: "Dr. Sandeep K. - Identity Verified", cat: "KYC/Verification", time: "2 hours ago", status: "Verified", color: "text-blue-600 bg-blue-50" },
                                { event: "Unusual Login Attempt - IP 192.168.1.1", cat: "Security", time: "5 hours ago", status: "Flagged", color: "text-amber-600 bg-amber-50" },
                                { event: "New Clinic Approved: City General", cat: "Onboarding", time: "1 day ago", status: "Approved", color: "text-emerald-600 bg-emerald-50" },
                            ].map((log, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/80 transition cursor-pointer">
                                    <td className="px-6 py-5 font-semibold text-gray-700">{log.event}</td>
                                    <td className="px-6 py-5 text-gray-500">{log.cat}</td>
                                    <td className="px-6 py-5 text-gray-400 text-sm">{log.time}</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${log.color}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
