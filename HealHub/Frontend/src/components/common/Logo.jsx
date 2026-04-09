import { HeartPulse } from "lucide-react";

/**
 * Standardized HealHub Logo Component (Portal-Matching Design)
 */
const Logo = ({
    className = "",
    showText = true,
    textClassName = "",
    size = "md",
    label = "",
    customText = "HealHub"
}) => {
    const sizeClasses = {
        sm: { container: "w-8 h-8", icon: "w-5 h-5", text: "text-lg" },
        md: { container: "w-10 h-10", icon: "w-6 h-6", text: "text-xl" },
        lg: { container: "w-14 h-14", icon: "w-8 h-8", text: "text-4xl" }
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    return (
        <div className={`flex items-center space-x-3 group ${className}`}>
            <div className={`${currentSize.container} bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 font-bold`}>
                <HeartPulse className={`${currentSize.icon} text-white`} />
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span className={`${currentSize.text} font-bold text-gray-900 tracking-tight transition-colors ${textClassName}`}>
                        {customText}
                    </span>
                    {label && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 -mt-1 pl-0.5">
                            {label}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};



export default Logo;
