"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { UserPlus, Trash2, Mail, Loader2, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { inviteTeamMember, removeTeamMember } from "@/app/actions/settingsActions";
import { cn } from "@/lib/utils";

export default function TeamTab({ initialMembers }: { initialMembers: any[] }) {
    const [members, setMembers] = useState(initialMembers);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [inviting, setInviting] = useState(false);

    const handleInvite = async () => {
        if (!email.trim() || !email.includes("@")) return toast.error("Enter a valid email");
        if (members.find((m) => m.email === email.trim())) return toast.error("Already invited");

        setInviting(true);
        const result = await inviteTeamMember({ email: email.trim(), role, status: "pending" });

        if (result.success) {
            setMembers([result.data, ...members]);
            setEmail("");
            toast.success(`Invite sent to ${email}`);
        } else {
            toast.error("Failed to send invite");
        }
        setInviting(false);
    };

    const handleRemove = async (memberId: string) => {
        const result = await removeTeamMember(memberId);
        if (result.success) {
            setMembers(members.filter((m) => m._id !== memberId));
            toast.success("Member removed");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg tracking-tight">Invite Team Member</h3>
                        <p className="text-sm text-slate-400">Add production staff to your workspace studio.</p>
                    </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <Input
                        placeholder="colleague@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 min-w-[240px] rounded-xl h-12 border-slate-200 bg-slate-50 focus:bg-white text-sm px-4"
                    />
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-40 rounded-xl bg-slate-50 border-slate-200 text-sm h-12"
                    >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                    </Select>
                    <Button
                        onClick={handleInvite}
                        disabled={inviting || !email}
                        className="rounded-xl h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-sm flex items-center gap-2 border-0 cursor-pointer"
                    >
                        {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                        Send Invite
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <h3 className="font-semibold text-slate-800 text-sm italic">Active Team Directory</h3>
                    </div>
                    <Badge className="bg-slate-100 text-slate-500 text-[10px] font-bold tracking-tight rounded-md border-0">{members.length} Members</Badge>
                </div>
                {members.length === 0 ? (
                    <div className="py-16 text-center">
                        <Users className="h-10 w-10 text-slate-100 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-400 italic">No studio members found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {members.map((member, i) => (
                            <motion.div
                                key={member._id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-slate-600">
                                        {member.email[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{member.email.split('@')[0]}</p>
                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                        <Mail className="h-3.5 w-3.5 text-slate-300" />{member.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={cn(
                                        "text-[10px] font-bold py-0.5 px-2 rounded-md border-0",
                                        member.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        {member.status}
                                    </Badge>
                                    <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{member.role}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleRemove(member._id)}
                                        className="h-9 w-9 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg border-0 bg-transparent cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
