import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    Star,
    Users,
    Award,
    ChevronRight,
    ArrowLeft,
    Zap,
    Activity,
    CheckCircle2,
    Stethoscope,
    Globe,
    Share2,
    Heart,
    Clock,
    Shield
} from "lucide-react";
import { BASE_URL, getAssetUrl } from "../../../services/api";
import patientService from "../services/patientService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ClinicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clinic, setClinic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [heroError, setHeroError] = useState(false);

    useEffect(() => {
        const fetchClinicData = async () => {
            try {
                const data = await patientService.getClinicDetails(id);
                setClinic(data);
                if (data.operatingHours) {
                    checkOpenStatus(data.operatingHours);
                }
            } catch (error) {
                console.error("Fetch clinic details error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClinicData();
    }, [id]);

    const checkOpenStatus = (hours) => {
        const now = new Date();
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const today = days[now.getDay()];
        const todayHours = hours[today];

        if (!todayHours || todayHours.isClosed || !todayHours.open || !todayHours.close) {
            setIsOpen(false);
            return;
        }

        const [startH, startM] = todayHours.open.split(":").map(Number);
        const [endH, endM] = todayHours.close.split(":").map(Number);
        const currentH = now.getHours();
        const currentM = now.getMinutes();

        const currentTime = currentH * 60 + currentM;
        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;

        setIsOpen(currentTime >= startTime && currentTime <= endTime);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!clinic) return (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto mt-12">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Facility Not Found</h3>
            <p className="text-gray-500 font-bold mt-3">The requested clinic profile is no longer active.</p>
            <button onClick={() => navigate("/patient/clinics")} className="mt-10 px-10 py-4 bg-teal-600 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">Back to discovery</button>
        </div>
    );

    return (
        <div className="space-y-10 pb-24 max-w-7xl mx-auto px-4 md:px-6">
            {/* Header / Navigation Bar */}
            <div className="flex items-center justify-between py-6">
                <button
                    onClick={() => navigate("/patient/clinics")}
                    className="group flex items-center text-gray-500 hover:text-teal-600 font-black text-xs uppercase tracking-widest transition-all"
                >
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center mr-4 group-hover:border-teal-200 group-hover:shadow-md transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    Back to Discovery
                </button>
                <div className="flex items-center space-x-4">
                    <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.1em] border-2 ${isOpen ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : "bg-red-50 text-red-600 border-red-100/50"}`}>
                        {isOpen ? "• Open Now" : "• Currently Closed"}
                    </span>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all shadow-sm">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Premium Hero Section */}
            <div className="relative">
                <div className="bg-white rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                    {/* Visual Banner (Cover) */}
                    <div className="h-[400px] relative overflow-hidden group">
                        {clinic.clinicImage && !heroError ? (
                            <img
                                src={getAssetUrl(clinic.clinicImage)}
                                alt={clinic.clinicName}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80";
                                    setHeroError(true);
                                }}
                            />
                        ) : (
                             <div className="w-full h-full bg-gradient-to-br from-teal-500 to-emerald-600"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        {/* Overlay Logo Position (Integrated with Banner) */}
                        <div className="absolute bottom-12 left-12 flex items-end space-x-8">
                            <div className="w-44 h-44 bg-white rounded-[3rem] p-3 shadow-2xl border-2 border-white/20 backdrop-blur-sm overflow-hidden flex-shrink-0">
                                <div className="w-full h-full bg-teal-50 rounded-[2.2rem] flex items-center justify-center overflow-hidden">
                                    <img
                                        src={getAssetUrl(clinic.clinicLogo)}
                                        alt="Clinic Logo"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                    />
                                </div>
                            </div>
                            <div className="pb-4">
                                <div className="flex items-center space-x-4 mb-3">
                                    <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">{clinic.clinicName}</h1>
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-xl">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center text-white/90 font-bold text-lg tracking-tight">
                                    <div className="w-8 h-8 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center mr-3 border border-white/10">
                                        <MapPin className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    {clinic.address}
                                </div>
                            </div>
                        </div>

                        {/* Top Right Badges (Floating on Banner) */}
                        <div className="absolute top-10 right-10 flex flex-col items-end gap-3">
                             <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 border border-white/20">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-black text-white tracking-tight">4.9 Rating</span>
                            </div>
                            <div className="bg-emerald-500/90 backdrop-blur-xl px-6 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 border border-emerald-400/50">
                                <Award className="w-4 h-4 text-white" />
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.1em]">Verified Healthcare Provider</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Brief Section (Overlayed on bottom of Hero Card) */}
                    <div className="px-12 py-10 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                            {/* Mission / Brief */}
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Activity className="w-5 h-5 text-teal-600" />
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Our Mission</h3>
                                </div>
                                <p className="text-gray-600 font-bold text-2xl leading-relaxed max-w-2xl">
                                    {clinic.description || "Leading the way in personalized medical excellence with state-of-the-art facilities."}
                                </p>
                            </div>

                            {/* Quantitative Metrics Card */}
                            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 flex items-center justify-between gap-10 shadow-sm border-2 border-dashed border-gray-100">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-4">Medical Staff</p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Users className="w-5 h-5 text-teal-600" />
                                        <p className="text-4xl font-black text-gray-900">{clinic.totalDoctors || 0}</p>
                                    </div>
                                </div>
                                <div className="w-px h-16 bg-gray-200"></div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-4">Years in Service</p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Award className="w-5 h-5 text-amber-500" />
                                        <p className="text-4xl font-black text-gray-900">15<span className="text-lg text-gray-400 ml-1">+</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Sections Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-12 pb-24 border-t border-gray-50 pt-16">
                        {/* Left Column: Essential Contacts & Amenities */}
                        <div className="lg:col-span-4 space-y-12">
                            {/* Direct Action / Contact Info */}
                            <section className="bg-teal-50/50 p-10 rounded-[3rem] border border-teal-100/50 space-y-8">
                                <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em]">Contact Channels</h3>
                                <div className="flex items-center group cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mr-5 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Primary Support</p>
                                        <p className="text-gray-900 text-xl font-black tracking-tight">{clinic.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center group cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mr-5 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                        <Mail className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Official Inquiries</p>
                                        <p className="text-gray-900 text-xl font-black tracking-tight break-all">{clinic.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center group cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mr-5 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                        <Clock className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Operating Status</p>
                                        <p className="text-teal-600 text-xl font-black tracking-tight">{isOpen ? "Available Now" : "Closed"}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Facilities Amenities Grid */}
                            {clinic.facilities && clinic.facilities.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Advanced Amenities
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {clinic.facilities.map((fac, idx) => (
                                            <div key={idx} className="flex items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                <Zap className="w-4 h-4 text-teal-500 mr-4" />
                                                <span className="text-xs font-black text-gray-700 tracking-tight">{fac}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Location Map View */}
                            {clinic.location && (
                                <section>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                                             <Globe className="w-4 h-4 mr-2 text-teal-600" />
                                             Clinic Location
                                        </h3>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${clinic.location.lat},${clinic.location.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-teal-600 font-bold text-[11px] uppercase tracking-widest hover:underline flex items-center"
                                        >
                                            Open in Maps
                                        </a>
                                    </div>
                                    <div className="h-[300px] rounded-[3rem] overflow-hidden border-8 border-gray-50 shadow-inner relative z-0">
                                        <MapContainer
                                            center={[clinic.location.lat, clinic.location.lng]}
                                            zoom={15}
                                            scrollWheelZoom={false}
                                            style={{ height: "100%", width: "100%" }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <Marker position={[clinic.location.lat, clinic.location.lng]}>
                                                <Popup>
                                                    <div className="text-center p-2">
                                                        <p className="font-black text-gray-900 border-b border-gray-100 pb-2 mb-2">{clinic.clinicName}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{clinic.address}</p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Specialists Showcase & Departments */}
                        <div className="lg:col-span-8 space-y-16">
                            {/* Specialists Spotlight */}
                            <section>
                                <div className="flex items-center justify-between mb-10 px-4">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Our Specialists</h3>
                                    <button className="px-6 py-2.5 bg-teal-50 text-teal-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-teal-600 hover:text-white transition-all">View All Staff</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {(clinic.topSpecialists && clinic.topSpecialists.length > 0) ? (
                                        clinic.topSpecialists.map((doc, i) => (
                                            <div key={i} className="group p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-[0_24px_48px_-12px_rgba(0,128,128,0.12)] hover:border-teal-200 transition-all duration-500 flex flex-col items-center text-center">
                                                <div className="w-28 h-28 bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-inner mb-6 group-hover:scale-105 transition-transform duration-500 border-4 border-white">
                                                    {doc.profilePhoto ? (
                                                        <img src={doc.profilePhoto} alt={doc.fullName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <Users className="w-12 h-12" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-4 w-full">
                                                    <div>
                                                        <p className="text-xl font-black text-gray-900 tracking-tight">{doc.fullName}</p>
                                                        <p className="text-[11px] text-teal-600 font-black uppercase tracking-[0.2em] mt-1">{doc.specialization}</p>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-4 py-4 border-y border-gray-50">
                                                        <div className="flex items-center text-amber-500">
                                                            <Star className="w-3 h-3 fill-amber-500 mr-1" />
                                                            <span className="text-[10px] font-black">4.9</span>
                                                        </div>
                                                        <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.experience} Years Exp</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => navigate(`/patient/book/${clinic._id}`, { state: { doctorId: doc._id } })} 
                                                        className="w-full py-4 bg-gray-900 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-teal-600 transition-all flex items-center justify-center group/btn"
                                                    >
                                                        Book Consultation
                                                        <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="md:col-span-2 text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-bold">Information about our specialists will be available shortly.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Departments / Specialized Centers Grid */}
                            <section>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-10 px-4">Specialized Departments</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {(clinic.departments && clinic.departments.length > 0) ? (
                                        clinic.departments.map((dept, i) => (
                                            <div
                                                key={i}
                                                onClick={() => navigate(`/patient/book/${clinic._id}`, { state: { department: dept.name } })}
                                                className="group p-10 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:border-teal-200 transition-all cursor-pointer relative overflow-hidden"
                                            >
                                                <div className="flex items-center justify-between mb-8 relative z-10">
                                                    <div className="w-20 h-20 bg-teal-50 rounded-[2.2rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                        <Stethoscope className="w-10 h-10 text-teal-600" />
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Consultants</div>
                                                        <span className="text-3xl font-black text-gray-900">{dept.doctorCount}</span>
                                                    </div>
                                                </div>
                                                <h4 className="font-black text-gray-900 text-2xl tracking-tight relative z-10">{dept.name}</h4>
                                                <div className="mt-6 flex items-center text-teal-600 text-[11px] font-black uppercase tracking-[0.2em] relative z-10 group-hover:translate-x-2 transition-transform">
                                                    <span>Explore Department</span>
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </div>
                                                {/* Decorative Accent */}
                                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-100/10 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"></div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="md:col-span-2 text-center py-16 bg-gray-50 rounded-[3.5rem] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-bold">Details for our clinical departments are being updated.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicProfile;
