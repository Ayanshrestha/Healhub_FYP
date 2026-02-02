import React from "react";
import { CheckCircle2 } from "lucide-react";

const SystemStatusPanel = ({ systemStatus }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-primary">System Status</h3>
            <div className="space-y-4">
                {systemStatus.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                        <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${s.bgColor} mr-3 shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                            <span className="font-semibold text-gray-700">{s.name}</span>
                        </div>
                        <span className={`text-sm font-bold ${s.iconColor}`}>{s.status}</span>
                    </div>
                ))}
            </div>
            <div className="mt-8 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                <div className="flex items-center space-x-3 text-teal-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold">All systems operational</span>
                </div>
            </div>
        </div>
    );
};

export default SystemStatusPanel;
