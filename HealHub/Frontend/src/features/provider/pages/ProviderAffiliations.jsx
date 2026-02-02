import React, { useState, useEffect } from "react";
import {
    Building2,
    Search,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Loader2,
    AlertCircle,
    Info,
    Bell
} from "lucide-react";
import * as providerService from "../services/providerService";

const ProviderAffiliations = () => {
    const [myAffiliations, setMyAffiliations] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchAffiliations();
        fetchDiscovery(); // Initial discovery load
    }, []);

    const fetchAffiliations = async () => {
        try {
            setLoading(true);
            const res = await providerService.getMyAffiliations();
            setMyAffiliations(res.affiliations || []);
        } catch (err) {
            console.error("Fetch affiliations error:", err);
            setMessage({ type: 'error', text: 'Failed to load your affiliations' });
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscovery = async (e) => {
        if (e) e.preventDefault();
        try {
            setSearchLoading(true);
            const res = await providerService.searchClinics(searchTerm);
            setSearchResults(res.clinics || []);
        } catch (err) {
            console.error("Search clinics error:", err);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleApply = async (clinicId) => {
        try {
            await providerService.applyToClinic(clinicId);
            setMessage({ type: 'success', text: 'Application submitted successfully!' });
            fetchAffiliations();
            setSearchResults(prev => prev.filter(c => c._id !== clinicId));
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit application' });
        }
    };

    const handleRespond = async (affiliationId, status) => {
        try {
            await providerService.respondToAffiliation(affiliationId, status);
            setMessage({ type: 'success', text: `Invitation ${status.toLowerCase()} successfully!` });
            fetchAffiliations();
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Action failed' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
        );
    }

    // Filter logic
    const invitations = myAffiliations.filter(a => a.requestedBy === 'CLINIC' && a.status === 'PENDING');
    const pendingApplications = myAffiliations.filter(a => a.requestedBy === 'PROVIDER' && a.status === 'PENDING');
    const activeAffiliations = myAffiliations.filter(a => a.status === 'ACTIVE');

    return (
        <div className="space-y-10 pb-20 font-primary">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Clinic Network</h1>
                    <p className="text-gray-500 font-bold mt-1 italic">Manage your professional affiliations and discover new clinical partners.</p>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-teal-50 rounded-2xl border border-teal-100">
                    <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-100">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="pr-4 pl-2">
                        <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest leading-none">Total Active</p>
                        <p className="text-lg font-black text-teal-700 leading-tight">{activeAffiliations.length}</p>
                    </div>
                </div>
            </div>

            {/* Action Message */}
            {message && (
                <div className={`p-4 rounded-2xl font-bold flex items-center mb-6 space-x-2 animate-fadeIn ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Discover & Invitations */}
                <div className="space-y-8">
                    {/* Invitations Section */}
                    {invitations.length > 0 && (
                        <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 space-y-4">
                            <h3 className="font-black text-amber-900 flex items-center space-x-2">
                                <Bell className="w-5 h-5 text-amber-600 animate-pulse" />
                                <span>Pending Invitations</span>
                            </h3>
                            <div className="space-y-3">
                                {invitations.map(inv => (
                                    <div key={inv._id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-50">
                                        <p className="font-black text-gray-900 text-sm">{inv.clinicId?.clinicName}</p>
                                        <p className="text-[10px] text-gray-500 font-bold italic mt-0.5">{inv.clinicId?.address?.city || 'Virtual'}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleRespond(inv._id, 'ACTIVE')}
                                                className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRespond(inv._id, 'REJECTED')}
                                                className="flex-1 py-2 bg-white text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition"
                                            >
                                                Ignore
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-black text-gray-900 flex items-center space-x-2">
                            <Plus className="w-5 h-5 text-teal-600" />
                            <span>Discover Clinics</span>
                        </h3>
                        <form onSubmit={fetchDiscovery} className="relative">
                            <input
                                type="text"
                                placeholder="Search by name or city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border-none pl-6 pr-14 py-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gray-900 text-white rounded-xl shadow-md hover:bg-black transition-all cursor-pointer"
                            >
                                {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            </button>
                        </form>

                        <div className="space-y-3 pt-2">
                            {searchResults.length > 0 ? searchResults.map((clinic) => (
                                <div key={clinic._id} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 hover:border-teal-100 transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-black text-gray-900 text-sm truncate max-w-[150px]">{clinic.clinicName}</p>
                                            <div className="flex items-center space-x-1 mt-1">
                                                <MapPin className="w-3 h-3 text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-500 italic lowercase">{clinic.address?.city || 'Virtual'}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleApply(clinic._id)}
                                            className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition shadow-sm"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                searchTerm && !searchLoading && (
                                    <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-[10px] font-bold text-gray-400 italic">No matching clinics found.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Existing Affiliations */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[60vh] flex flex-col">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-slate-50/30">
                            <h3 className="font-black text-gray-900 flex items-center space-x-2">
                                <Building2 className="w-5 h-5 text-teal-600" />
                                <span>Professional Network</span>
                            </h3>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                                </div>
                                <div className="flex items-center space-x-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Applied</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 divide-y divide-gray-50">
                            {/* Active Affiliations */}
                            {activeAffiliations.length > 0 && activeAffiliations.map((aff) => (
                                <div key={aff._id} className="p-8 hover:bg-teal-50/20 transition-all group">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-14 h-14 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center text-teal-600 font-black shadow-sm group-hover:border-teal-100 transition-all">
                                                {(aff.clinicId?.clinicName || "C").charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-gray-900 leading-tight">{aff.clinicId?.clinicName}</h4>
                                                <div className="flex items-center gap-4 mt-1.5">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-3 h-3 text-gray-400" />
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{aff.clinicId?.address?.city || "Nepal"}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Joined {new Date(aff.affiliatedAt || aff.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                                            <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-center">
                                                Active Link
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-teal-600 transition-all border border-transparent hover:border-teal-50">
                                                    <Phone className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-teal-600 transition-all border border-transparent hover:border-teal-50">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pending Applications */}
                            {pendingApplications.length > 0 && pendingApplications.map((aff) => (
                                <div key={aff._id} className="p-8 bg-slate-50/20 hover:bg-slate-50/40 transition-all group opacity-80">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-14 h-14 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center text-amber-500 font-black shadow-sm group-hover:border-amber-100 transition-all">
                                                {(aff.clinicId?.clinicName || "C").charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-gray-400 leading-tight italic">{aff.clinicId?.clinicName}</h4>
                                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">Application Pending...</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-black uppercase tracking-widest rounded-full">
                                                Waiting for Clinic
                                            </span>
                                            <button className="p-2 bg-white text-gray-300 rounded-lg hover:text-red-500 border border-gray-100 transition-all">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {activeAffiliations.length === 0 && pendingApplications.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full p-20 text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200">
                                        <Building2 className="w-12 h-12" />
                                    </div>
                                    <div className="max-w-xs">
                                        <h4 className="text-xl font-black text-gray-900 tracking-tight">Empty Network</h4>
                                        <p className="text-sm font-bold text-gray-400 italic mt-2 leading-relaxed">
                                            Find pharmacies or clinics to link your profile and start receiving patient bookings.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderAffiliations;
