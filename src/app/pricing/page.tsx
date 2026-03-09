"use client";

import React from "react";
import { Check, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const router = useRouter();

    const handleSubscribe = async (priceId: string) => {
        if (!priceId) return; // Free plan
        // Redirect to checkout session action (will create next)
        router.push(`/api/stripe/checkout?priceId=${priceId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <Sparkles className="h-3.5 w-3.5" /> Simple Pricing
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
                        Synthesize Knowledge <br /> Without Limits
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Choose the perfect plan to transform your learning materials into
                        high-production cinematic video courses.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative bg-white rounded-[40px] p-10 border transition-all duration-300 group hover:shadow-2xl hover:shadow-violet-200/50",
                                plan.featured
                                    ? "border-violet-500 ring-4 ring-violet-500/10 shadow-xl shadow-violet-200/40"
                                    : "border-slate-100 hover:border-slate-200"
                            )}
                        >
                            {plan.featured && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-violet-500/30">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-10">
                                <div
                                    className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center mb-6",
                                        plan.id === "free" && "bg-slate-100 text-slate-500",
                                        plan.id === "pro" && "bg-violet-100 text-violet-600",
                                        plan.id === "unlimited" && "bg-amber-100 text-amber-600"
                                    )}
                                >
                                    {plan.id === "free" && <Zap className="h-6 w-6" />}
                                    {plan.id === "pro" && <Crown className="h-6 w-6" />}
                                    {plan.id === "unlimited" && <Shield className="h-6 w-6" />}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900">
                                        ${plan.price}
                                    </span>
                                    <span className="text-slate-400 font-bold text-sm">
                                        /month
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                                            <Check className="h-3 w-3 text-emerald-600" />
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium leading-relaxed">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => handleSubscribe(plan.priceId)}
                                className={cn(
                                    "w-full h-14 rounded-2xl font-bold transition-all border-0 cursor-pointer shadow-lg",
                                    plan.featured
                                        ? "bg-slate-900 text-white hover:bg-violet-600 shadow-violet-500/20"
                                        : "bg-slate-50 text-slate-900 hover:bg-slate-100 shadow-none border border-slate-200"
                                )}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center max-w-2xl mx-auto space-y-6">
                    <div className="h-px bg-slate-100 w-full" />
                    <p className="text-slate-400 text-sm font-medium">
                        Tired of manual video editing? Our AI Engine generates high-retention
                        lessons in seconds. Trusted by over 10,000+ educators worldwide.
                    </p>
                    <div className="flex items-center justify-center gap-8 pt-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {/* Logo clouds would go here */}
                        <span className="text-xl font-bold text-slate-900 tracking-tighter">Stripe Verified</span>
                        <div className="h-4 w-px bg-slate-100" />
                        <span className="text-xl font-bold text-slate-900 tracking-tighter">PCI Compliant</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
