import { useState, useEffect } from "react";
import { Search, MapPin, Star, Users, ChevronRight, Filter, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import patientService from "../services/patientService";

const ClinicDiscovery = () => {
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const result = await patientService.getClinics();
                setClinics(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error("Fetch clinics error:", error);
                setClinics([]);
            } finally {
                setLoading(false);
            }
        };
        fetchClinics();
    }, []);

    const filteredClinics = clinics.filter(clinic =>
        clinic.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Discover Clinics</h2>
                    <p className="text-gray-500 text-sm mt-1">Find healthcare facilities in your area</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search clinics..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full md:w-64 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClinics.map((clinic) => (
                    <div
                        key={clinic._id}
                        onClick={() => navigate(`/patient/clinics/${clinic._id}`)}
                        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                    >
                        <div className="h-40 bg-gray-100 relative">
                            {clinic.images?.[0] ? (
                                <img src={clinic.images[0]} alt={clinic.clinicName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-teal-50">
                                    <ShieldCheck className="w-12 h-12 text-teal-200" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className="px-2 py-1 bg-white/90 rounded-lg text-[9px] font-bold text-teal-600 uppercase tracking-wider">
                                    Verified
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{clinic.clinicName}</h3>
                            <div className="flex items-center text-gray-400 text-xs mt-1">
                                <MapPin className="w-3 h-3 mr-1 text-teal-500" />
                                <span className="line-clamp-1">{clinic.address}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 my-4">
                                <div className="bg-gray-50 p-2 rounded-lg text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Doctors</p>
                                    <span className="text-sm font-bold text-gray-700">{clinic.totalDoctors || 0}</span>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Rating</p>
                                    <span className="text-sm font-bold text-gray-700">4.8</span>
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center justify-center">
                                <span>View Profile</span>
                                <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredClinics.length === 0 && (
                <div className="py-16 text-center bg-white rounded-xl border border-dashed border-gray-100">
                    <Search className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-gray-400 uppercase">No clinics found</h3>
                    <button
                        onClick={() => setSearchTerm("")}
                        className="mt-4 text-teal-600 text-xs font-bold"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClinicDiscovery;
