import React from "react";

const PatientFooter = () => {
    return (
        <div className="text-center">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] leading-none">
                © {new Date().getFullYear()} HealHub Healthcare Systems. All rights reserved.
            </p>
        </div>
    );
};

export default PatientFooter;
