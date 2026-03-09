"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Webhook as WebhookIcon, Globe, Trash2, Plus, Loader2, Sparkles, Server } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { createWebhook } from "@/app/actions/settingsActions";

export default function WebhooksTab({ initialHooks }: { initialHooks: any[] }) {
    const [hooks, setHooks] = useState(initialHooks);
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!url.trim().startsWith("http")) return toast.error("Enter a valid URL");
        if (!name.trim()) return toast.error("Enter a webhook name");

        setCreating(true);
        const result = await createWebhook({ url: url.trim(), name: name.trim(), status: "active" });

        if (result.success) {
            setHooks([result.data, ...hooks]);
            setUrl("");
            setName("");
            toast.success("Webhook endpoint registered!");
        } else {
            toast.error("Failed to register webhook");
        }
        setCreating(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm overflow-hidden relative">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                        <WebhookIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">API Webhooks</h3>
                        <p className="text-sm text-slate-400 font-medium">Connect external systems to lesson events</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endpoint Name</label>
                        <Input
                            placeholder="e.g. Slack Integration"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-2xl h-14 border-slate-100 bg-slate-50 focus:bg-white transition-all text-base px-5 font-semibold text-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payload URL</label>
                        <Input
                            placeholder="https://hooks.example.com/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="rounded-2xl h-14 border-slate-100 bg-slate-50 focus:bg-white transition-all text-base px-5 font-semibold text-slate-700"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleCreate}
                    disabled={creating || !url || !name}
                    className="w-full rounded-2xl h-14 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 border-0 cursor-pointer"
                >
                    {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 mr-1" />}
                    Register Webhook Node
                </Button>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-50 overflow-hidden shadow-sm">
                <div className="px-10 py-7 border-b border-slate-50 flex items-center gap-3">
                    <Server className="h-5 w-5 text-indigo-500" />
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Registered Endpoints</h3>
                    <div className="ml-auto flex items-center gap-1.5 opacity-40">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Live Monitor</span>
                    </div>
                </div>
                {hooks.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="h-24 w-24 rounded-full bg-slate-50 border border-slate-100 border-dashed flex items-center justify-center mx-auto mb-6">
                            <Globe className="h-8 w-8 text-slate-200" />
                        </div>
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest leading-relaxed">No Cloud Hooks <br />Configured</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {hooks.map((hook, i) => (
                            <motion.div
                                key={hook._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-6 px-10 py-7 hover:bg-slate-50/40 transition-all group"
                            >
                                <div className="h-14 w-14 rounded-3xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-500">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1.5 transition-colors group-hover:text-indigo-600">{hook.name}</p>
                                    <p className="text-xs text-slate-400 font-bold truncate flex items-center gap-1.5">
                                        <span className="h-1 w-1 rounded-full bg-slate-400 group-hover:bg-indigo-400" /> {hook.url}
                                    </p>
                                </div>
                                <div className="hidden sm:flex flex-col items-end gap-1.5 px-4 h-full border-x border-slate-50">
                                    <Badge className="bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest border-0 py-1 px-2.5 rounded-lg shadow-inner">
                                        {hook.status}
                                    </Badge>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase italic">Status active</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="h-12 w-12 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl border-0 bg-transparent cursor-pointer transition-all"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
