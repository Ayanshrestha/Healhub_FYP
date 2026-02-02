import React, { useState } from "react";
import { Check, CreditCard, Loader2 } from "lucide-react";
import axios from "axios";

const ClinicSubscription = () => {
    const [loading, setLoading] = useState(null); // stores the plan name being processed

    const plans = [
        {
            name: "BASIC",
            price: "1,000",
            duration: "1 Month",
            features: ["Full Patient Dashboard", "Appointment Management", "Basic Analytics"],
            color: "bg-blue-600"
        },
        {
            name: "STANDARD",
            price: "5,000",
            duration: "6 Months",
            features: ["Everything in Basic", "Advanced Analytics", "Staff Management"],
            color: "bg-emerald-600"
        },
        {
            name: "PREMIUM",
            price: "9,000",
            duration: "12 Months",
            features: ["Everything in Standard", "Priority Support", "Custom Branding"],
            color: "bg-purple-600"
        }
    ];

    const handleSubscribe = async (planName) => {
        setLoading(planName);
        try {
            const data = await clinicService.initiateSubscription(planName);
            if (data.payment_url) {
                // Redirect to Khalti
                window.location.href = data.payment_url;
            }
        } catch (error) {
            alert(error.response?.data?.message || error.message || "Failed to initiate payment");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Select Your Plan</h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Your clinic has been approved! Select a subscription plan below to activate your facility and start managing patients.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div key={plan.name} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{plan.duration}</h3>
                                <h2 className="text-3xl font-black text-gray-900">{plan.name}</h2>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-black text-gray-900">NPR {plan.price}</span>
                                    <span className="text-gray-400 ml-2">/ term</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-grow">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center space-x-3 text-gray-600">
                                        <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-emerald-600" />
                                        </div>
                                        <span className="font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSubscribe(plan.name)}
                                disabled={loading !== null}
                                className={`w-full py-4 rounded-2xl font-black text-white ${plan.color} shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-95 disabled:opacity-50`}
                            >
                                {loading === plan.name ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        <span>Select Plan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-400 text-sm">
                        Payments are securely processed via <span className="font-bold text-teal-600">Khalti Payment Gateway</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClinicSubscription;
