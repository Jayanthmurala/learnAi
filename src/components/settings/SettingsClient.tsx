"use client";

import React, { useState } from "react";
import { User, Users, Webhook, CreditCard } from "lucide-react";
import TeamTab from "@/components/settings/TeamTab";
import WebhooksTab from "@/components/settings/WebhooksTab";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
    { id: "profile", label: "Studio Profile", icon: User, desc: "Personal settings" },
    { id: "billing", label: "Billing & Plans", icon: CreditCard, desc: "Manage subscriptions" },
    { id: "team", label: "Team Studio", icon: Users, desc: "Staff & roles" },
    { id: "webhooks", label: "Cloud Hooks", icon: Webhook, desc: "API integrations" },
];

export default function SettingsClient({ user, initialMembers, initialHooks }: { user: any, initialMembers: any[], initialHooks: any[] }) {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto min-h-screen">
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Workspace Settings</h1>
                <p className="text-slate-400 mt-2 text-lg font-medium">
                    Configure your profile, team, and integrations.
                </p>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-12">
                {/* Navigation Sidebar */}
                <div className="space-y-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 border cursor-pointer",
                                activeTab === tab.id
                                    ? "bg-slate-900 border-slate-900 text-white"
                                    : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <tab.icon className="h-5 w-5" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold truncate leading-none mb-1">{tab.label}</p>
                                <p className={cn("text-xs transition-colors", activeTab === tab.id ? "text-slate-400" : "text-slate-400")}>{tab.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "profile" && (
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center">
                                            <User className="h-6 w-6 text-violet-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-xl tracking-tight">Studio Profile</h3>
                                            <p className="text-sm text-slate-400 mt-0.5">Your personal identity and access node.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 ml-1">Full Name</label>
                                            <Input
                                                value={user?.name || "AI Director"}
                                                disabled
                                                className="rounded-xl h-12 border-slate-200 bg-slate-50 text-slate-900 font-medium px-4"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 ml-1">Email Address</label>
                                            <Input
                                                value={user?.email || "hello@example.com"}
                                                disabled
                                                className="rounded-xl h-12 border-slate-200 bg-slate-50 text-slate-900 font-medium px-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-50">
                                        <p className="text-xs text-slate-400 italic">Profile data is managed via your authentication provider.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "billing" && (
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center">
                                            <CreditCard className="h-6 w-6 text-violet-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-xl tracking-tight">Billing & Plans</h3>
                                            <p className="text-sm text-slate-400 mt-0.5">Manage your subscription and invoicing.</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 mb-8 font-medium">
                                        <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                                            Access the secure Stripe Customer Portal to update your payment method, view invoices, or change your plan.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => window.location.href = '/api/stripe/portal'}
                                            className="px-8 h-12 rounded-xl bg-slate-900 text-white font-bold text-sm transition-all hover:bg-violet-600 border-0 cursor-pointer shadow-lg shadow-slate-200"
                                        >
                                            Manage Billing Portal
                                        </button>
                                        <button
                                            onClick={() => window.location.href = '/pricing'}
                                            className="px-8 h-12 rounded-xl bg-white text-slate-900 font-bold text-sm transition-all border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                        >
                                            View Pricing Plans
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "team" && <TeamTab initialMembers={initialMembers} />}
                            {activeTab === "webhooks" && <WebhooksTab initialHooks={initialHooks} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
