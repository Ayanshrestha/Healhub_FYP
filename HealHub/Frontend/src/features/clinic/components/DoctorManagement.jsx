import React from "react";
import { UserCheck, UserX, UserPlus, Eye, MoreVertical, Building, Search, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
                                                src={app.providerId?.profilePhoto || `https://ui-avatars.com/api/?name=${app.providerId?.fullName}&background=F1F5F9&color=0D9488`}
                                                className="w-full h-full object-cover rounded-2xl"
                                                alt=""
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
                                            src={doctor.profilePhoto || `https://ui-avatars.com/api/?name=${doctor.fullName}&background=F0FDFA&color=0D9488`}
                                            className="w-full h-full object-cover"
                                            alt=""
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
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-teal-500/20 transition-all duration-700"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <h3 className="text-3xl font-black tracking-tight">Invite Practitioners</h3>
                            <p className="text-slate-400 font-bold mt-1 text-sm">Expand your clinical network by inviting specialized doctors.</p>
                        </div>
                        <div className="flex items-center space-x-3 w-full md:w-auto">
                            <select
                                value={specializationFilter}
                                onChange={(e) => setSpecializationFilter(e.target.value)}
                                className="bg-white/10 border-white/10 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-48 appearance-none cursor-pointer hover:bg-white/15 transition-all text-white"
                            >
                                <option value="" className="bg-slate-900">All Specializations</option>
                                {specializations.map(s => (
                                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAvailable.length === 0 ? (
                            <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-white/10">
                                <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                <p className="text-white/40 font-bold text-xs uppercase tracking-widest">No available doctors found</p>
                            </div>
                        ) : (
                            filteredAvailable.map((doc) => (
                                <div key={doc._id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/[0.08] hover:border-teal-500/50 transition-all group/card">
                                    <div className="flex items-center space-x-4 mb-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 overflow-hidden border border-white/5 group-hover/card:scale-105 transition-transform">
                                            <img
                                                src={doc.profilePhoto || `https://ui-avatars.com/api/?name=${doc.fullName}&background=1e293b&color=fff`}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white group-hover/card:text-teal-400 transition-colors">{doc.fullName}</h4>
                                            <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mt-0.5">{doc.specialization}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                            <Clock className="w-3 h-3 mr-2 text-teal-500" />
                                            <span>{doc.experienceYears} Years Experience</span>
                                        </div>
                                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                            <Eye className="w-3 h-3 mr-2 text-teal-500" />
                                            <span className="truncate">{doc.qualification}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onInvite(doc._id)}
                                        className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-colors shadow-lg"
                                    >
                                        Send Invitation
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorManagement;
