import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    ShieldCheck,
    Globe,
    Star,
    Users,
    Award,
    ChevronRight,
    Share2,
    Heart,
    Plus,
    Shield,
    Loader2,
    Stethoscope,
    ArrowLeft,
    Zap,
    Activity,
    CheckCircle2
} from "lucide-react";
import { BASE_URL } from "../../../services/api";
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
    const [logoError, setLogoError] = useState(false);

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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!clinic) return (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Facility Not Found</h3>
            <p className="text-gray-500 font-bold mt-2">The requested clinic profile is no longer active.</p>
            <button onClick={() => navigate("/patient/clinics")} className="mt-8 px-8 py-3 bg-teal-600 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all">Back to discovery</button>
        </div>
    );



    return (
        <div className="space-y-12 pb-24 max-w-7xl mx-auto">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between px-2">
                <button
                    onClick={() => navigate("/patient/clinics")}
                    className="group flex items-center text-gray-400 hover:text-teal-600 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center mr-3 group-hover:border-teal-200 group-hover:shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Discovery
                </button>
                <div className="flex items-center space-x-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isOpen ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                        {isOpen ? "Open Now" : "Currently Closed"}
                    </span>
                </div>
            </div>

            {/* Main Profile Hero Card */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
                {/* Visual Banner */}
                <div className="h-72 relative">
                    {clinic.clinicImage && !heroError ? (
                        <img
                            src={`${BASE_URL}${clinic.clinicImage}`}
                            alt="Clinic Banner"
                            className="w-full h-full object-cover"
                            onError={() => setHeroError(true)}
                        />
                    ) : null}
                    {(heroError || !clinic.clinicImage) && (
                        <img
                            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
                            alt="Clinic Banner Fallback"
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Floating Badges */}
                    <div className="absolute top-8 right-8 flex flex-col items-end gap-3">
                        <div className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl flex items-center space-x-2 border border-white">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-gray-900 tracking-tight">4.9</span>
                        </div>
                        <div className="bg-teal-600 px-5 py-2 rounded-2xl shadow-xl flex items-center space-x-2 border border-teal-500">
                            <Award className="w-4 h-4 text-white" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Medical Facility</span>
                        </div>
                    </div>
                </div>

                <div className="px-10 pb-12 relative">
                    {/* Logo & Identity */}
                    <div className="relative -mt-20 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100/80">
                        <div className="flex flex-col md:flex-row md:items-end gap-8">
                            <div className="w-40 h-40 bg-white rounded-[2.5rem] p-2 shadow-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-teal-50 rounded-[2rem] flex items-center justify-center">
                                    {clinic.clinicLogo && !logoError ? (
                                        <img
                                            src={`${BASE_URL}${clinic.clinicLogo}`}
                                            alt="Logo"
                                            className="w-full h-full object-cover"
                                            onError={() => setLogoError(true)}
                                        />
                                    ) : null}
                                    {(logoError || !clinic.clinicLogo) && (
                                        <ShieldCheck className="w-16 h-16 text-teal-600" />
                                    )}
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{clinic.clinicName}</h1>
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-400 font-bold text-sm tracking-tight">
                                    <MapPin className="w-4 h-4 mr-2 text-red-400" />
                                    {clinic.address}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                            <div className="text-center px-6 border-r border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Staff</p>
                                <p className="text-2xl font-black text-gray-900">{clinic.totalDoctors || 0}</p>
                            </div>
                            <div className="text-center px-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                                <p className="text-2xl font-black text-gray-900">15+ <span className="text-sm font-bold text-gray-400">Yrs</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12">
                        {/* Info Column */}
                        <div className="lg:col-span-4 space-y-10">
                            <section>
                                <div className="flex items-center space-x-2 mb-4">
                                    <Activity className="w-5 h-5 text-teal-600" />
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Medical Vision</h3>
                                </div>
                                <p className="text-gray-600 font-bold text-lg leading-relaxed italic">
                                    "{clinic.description || "Providing compassionate care with cutting-edge medical technology for our community."}"
                                </p>
                            </section>

                            <section className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-5">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Direct Contact</h3>
                                <div className="flex items-center group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                        <Phone className="w-5 h-5 text-teal-600 font-black" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support line</p>
                                        <p className="text-gray-900 text-lg font-black tracking-tight">{clinic.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                        <Mail className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Email</p>
                                        <p className="text-gray-900 text-lg font-black tracking-tight">{clinic.email}</p>
                                    </div>
                                </div>
                            </section>

                            {clinic.facilities && clinic.facilities.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Facility Amenities</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {clinic.facilities.map((fac, idx) => (
                                            <div key={idx} className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                <Zap className="w-4 h-4 text-teal-500 mr-3" />
                                                <span className="text-xs font-black text-gray-700 tracking-tight">{fac}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {clinic.location && (
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Visit Us</h3>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${clinic.location.lat},${clinic.location.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-teal-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center"
                                        >
                                            Get Directions
                                            <Globe className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                    <div className="h-64 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative z-0">
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
                                                    <div className="text-center font-primary">
                                                        <p className="font-black text-gray-900">{clinic.clinicName}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold">{clinic.address}</p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Specialists / Departments Column */}
                        <div className="lg:col-span-8 space-y-12">
                            <section>
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Our Specialists</h3>
                                    <button className="text-teal-600 font-black text-xs uppercase tracking-widest hover:underline">View All Staff</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {clinic.topSpecialists?.map((doc, i) => (
                                        <div key={i} className="group p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex items-center space-x-6">
                                            <div className="w-20 h-20 bg-gray-100 rounded-3xl overflow-hidden shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                                                {doc.profilePhoto ? (
                                                    <img src={doc.profilePhoto} alt={doc.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Users className="w-10 h-10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{doc.fullName}</p>
                                                <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest mt-0.5">{doc.specialization}</p>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-gray-400">{doc.experience} Years Exp</span>
                                                    <button onClick={() => navigate(`/patient/book/${clinic._id}`, { state: { doctorId: doc._id } })} className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8 px-2">Specialized Departments</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {clinic.departments?.map((dept, i) => (
                                        <div
                                            key={i}
                                            onClick={() => navigate(`/patient/book/${clinic._id}`, { state: { department: dept.name } })}
                                            className="group p-8 bg-gradient-to-br from-white to-gray-50/50 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-teal-300/50 transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="w-16 h-16 bg-teal-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Stethoscope className="w-8 h-8 text-teal-600" />
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Doctors</div>
                                                    <span className="text-2xl font-black text-gray-900">{dept.doctorCount}</span>
                                                </div>
                                            </div>
                                            <h4 className="font-black text-gray-900 text-xl tracking-tight mt-6 relative z-10">{dept.name}</h4>
                                            <div className="mt-4 flex items-center text-teal-600 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
                                                <span>Book Appointment</span>
                                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            {/* Decorative Background Element */}
                                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-teal-100/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                        </div>
                                    ))}
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
