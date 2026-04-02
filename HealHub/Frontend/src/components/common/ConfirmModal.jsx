import React from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * Reusable custom confirmation modal to replace native window.confirm()
 *
 * Usage:
 *   <ConfirmModal
 *     isOpen={showConfirm}
 *     title="Activate Account"
 *     message="Are you sure you want to activate this user?"
 *     confirmText="Yes, Activate"
 *     confirmVariant="success"   // "danger" | "success" | "warning"
 *     onConfirm={handleConfirm}
 *     onCancel={() => setShowConfirm(false)}
 *   />
 */
const ConfirmModal = ({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger", // "danger" | "success" | "warning"
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger:  "bg-red-600 hover:bg-red-700 focus:ring-red-300",
        success: "bg-teal-600 hover:bg-teal-700 focus:ring-teal-300",
        warning: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-300",
    };

    const iconColors = {
        danger:  "text-red-500 bg-red-50",
        success: "text-teal-500 bg-teal-50",
        warning: "text-amber-500 bg-amber-50",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${iconColors[confirmVariant]}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{message}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all focus:outline-none focus:ring-4 ${variantStyles[confirmVariant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
