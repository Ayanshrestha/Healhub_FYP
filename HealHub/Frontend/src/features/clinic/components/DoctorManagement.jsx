import React from "react";
import { UserCheck, UserX, UserPlus, Eye, MoreVertical, Building, Search, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAssetUrl } from "../../../services/api";

const DoctorManagement = ({
    doctors = [],
    applications = [],
    availableDoctors = [],
    onAffiliationAction,
    onInvite,
    onRemove
}) => {
    const navigate = useNavigate();
    const [specializationFilter, setSpecializationFilter] = React.useState("");

    // Get unique specializations for filter
    const specializations = Array.from(new Set(availableDoctors.map(d => d.specialization))).filter(Boolean);

    const filteredAvailable = availableDoctors.filter(doc =>
        !specializationFilter || doc.specialization === specializationFilter
    );

    return (
        <div className="space-y-10">
            {/* Affiliation Requests Section */}
            {applications.length > 0 && (
                <div className="bg-amber-50/50 rounded-[2.5rem] p-8 border border-amber-100/50 shadow-sm animate-fadeIn">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-amber-900 tracking-tight">Pending Applications</h3>
                            <p className="text-xs font-bold text-amber-600/70 uppercase tracking-widest">Doctors requesting to join your clinic</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            onClick={() => navigate(`/clinic/doctors/${app.providerId?._id}`)}
                                            className="w-12 h-12 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-teal-600 font-black cursor-pointer hover:bg-teal-50 transition-colors"
                                        >
                                            <img
                                                src={app.providerId?.profilePhoto
                                                    ? getAssetUrl(app.providerId.profilePhoto)
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(app.providerId?.fullName || "Doctor")}&background=F1F5F9&color=0D9488`}
                                                className="w-full h-full object-cover rounded-2xl"
                                                alt=""
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.providerId?.fullName || "Doctor")}&background=F1F5F9&color=0D9488`;
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h4
                                                onClick={() => navigate(`/clinic/doctors/${app.providerId?._id}`)}
                                                className="font-black text-gray-900 leading-tight cursor-pointer hover:text-teal-600 transition-colors"
                                            >
                                                {app.providerId?.fullName}
                                            </h4>
                                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider">{app.providerId?.specialization || app.providerType}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => navigate(`/clinic/doctors/${app.providerId?._id}`)}
                                            className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => onAffiliationAction(app._id, 'ACTIVE')}
                                            className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-sm"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => onAffiliationAction(app._id, 'REJECTED')}
                                            className="px-4 py-1.5 bg-white text-red-500 border border-red-100 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Staff Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                            <Building className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Affiliated Clinical Staff</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Doctors & Practitioners linked to this facility</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                            <Building className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <h4 className="text-gray-400 font-black tracking-tight">No affiliated clinical staff</h4>
                            <p className="text-xs font-bold text-gray-300 italic mt-1 uppercase tracking-tighter">Verified doctors will appear here</p>
                        </div>
                    ) : (
                        doctors.map((doctor) => (
                            <div
                                key={doctor._id}
                                className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50/50 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl overflow-hidden border border-teal-100 group-hover:scale-110 transition-transform">
                                        <img
                                            src={doctor.profilePhoto
                                                ? getAssetUrl(doctor.profilePhoto)
                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName || "Doctor")}&background=F0FDFA&color=0D9488`}
                                            className="w-full h-full object-cover"
                                            alt=""
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName || "Doctor")}&background=F0FDFA&color=0D9488`;
                                                e.target.onerror = null;
                                            }}
                                        />
                                    </div>
                                    <div className={`flex items-center px-3 py-1 rounded-full border ${doctor.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${doctor.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        <span className="text-[8px] font-black uppercase tracking-widest italic leading-none pt-0.5">{doctor.status}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-black text-gray-900 text-lg leading-tight group-hover:text-teal-600 transition-colors uppercase tracking-tight">{doctor.fullName}</h4>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doctor.specialization}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex -space-x-1">
                                            <button
                                                onClick={() => navigate(`/clinic/doctors/${doctor._id}`)}
                                                className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-teal-600 hover:bg-teal-50 transition-all cursor-pointer"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => onRemove(doctor._id)}
                                            className="p-2.5 bg-white text-gray-200 hover:text-red-500 border border-transparent hover:border-red-50 transition-all rounded-xl"
                                        >
                                            <UserX className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Invite Doctors Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-teal-100 transition-all duration-700"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Invite Practitioners</h3>
                            <p className="text-gray-500 font-bold mt-1 text-sm">Expand your clinical network by inviting specialized doctors.</p>
                        </div>
                        <div className="flex items-center space-x-3 w-full md:w-auto">
                            <div className="relative w-full md:w-48">
                                <select
                                    value={specializationFilter}
                                    onChange={(e) => setSpecializationFilter(e.target.value)}
                                    className="bg-gray-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none w-full appearance-none cursor-pointer hover:bg-white transition-all text-gray-700"
                                >
                                    <option value="">All Specializations</option>
                                    {specializations.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Search className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAvailable.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No available doctors found</p>
                                <p className="text-[10px] text-gray-300 font-bold uppercase mt-2">Try adjusting your filters</p>
                            </div>
                        ) : (
                            filteredAvailable.map((doc) => (
                                <div key={doc._id} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-teal-50/50 hover:border-teal-100 transition-all group/card">
                                    <div className="flex items-center space-x-4 mb-5">
                                        <div className="w-14 h-14 rounded-2xl bg-teal-50 overflow-hidden border border-teal-100 group-hover/card:scale-105 transition-transform">
                                            <img
                                                src={doc.profilePhoto
                                                    ? getAssetUrl(doc.profilePhoto)
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName || "Doctor")}&background=F0FDFA&color=0D9488`}
                                                className="w-full h-full object-cover"
                                                alt=""
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName || "Doctor")}&background=F0FDFA&color=0D9488`;
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 group-hover/card:text-teal-600 transition-colors uppercase tracking-tight">{doc.fullName}</h4>
                                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-0.5">{doc.specialization}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                            <div className="p-1 bg-teal-50 rounded-md mr-3">
                                                <Clock className="w-3 h-3 text-teal-600" />
                                            </div>
                                            <span>{doc.experienceYears} Years Exp.</span>
                                        </div>
                                        <div className="flex items-center text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                            <div className="p-1 bg-teal-50 rounded-md mr-3">
                                                <Building className="w-3 h-3 text-teal-600" />
                                            </div>
                                            <span className="truncate">{doc.qualification}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/clinic/doctors/${doc._id}`)}
                                            className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => onInvite(doc._id)}
                                            className="flex-[2] py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-teal-100"
                                        >
                                            Send Invitation
                                        </button>
                                    </div>
                                </div>
                            ) )
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DoctorManagement;
