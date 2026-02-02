import React from "react";
import { UserPlus, Calendar, CheckCircle, Bell, Clock } from "lucide-react";

const ActivityTimeline = ({ activities = [] }) => {
    const getIcon = (type) => {
        switch (type) {
            case "DOCTOR_ADDED": return { icon: UserPlus, bg: "bg-teal-100", text: "text-teal-600" };
            case "SCHEDULE_UPDATED": return { icon: Calendar, bg: "bg-emerald-100", text: "text-emerald-600" };
            case "APPT_COMPLETED": return { icon: CheckCircle, bg: "bg-teal-100", text: "text-teal-600" };
            default: return { icon: Bell, bg: "bg-gray-100", text: "text-gray-600" };
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Clinic Activity</h3>
            <div className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-gray-400 font-bold text-center py-6">No recent activity</p>
                ) : (
                    activities.map((activity, idx) => {
                        const theme = getIcon(activity.type);
                        return (
                            <div key={idx} className="flex items-start space-x-4">
                                <div className={`w-10 h-10 ${theme.bg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                    <theme.icon className={`w-5 h-5 ${theme.text}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 leading-tight">{activity.title}</p>
                                    <p className="text-sm text-gray-500 font-medium mt-0.5">{activity.description}</p>
                                    <div className="flex items-center space-x-1 text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 px-2 py-0.5 bg-gray-50 rounded-lg w-fit">
                                        <Clock className="w-3 h-3" />
                                        <span>{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ActivityTimeline;
