"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, FileText, CheckCircle2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
    completed: { label: "Ready", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    processing: { label: "Analyzing", icon: Loader2, class: "bg-amber-50 text-amber-700 border-amber-200" },
    failed: { label: "Failed", icon: AlertCircle, class: "bg-red-50 text-red-700 border-red-200" },
};

interface RecentDocumentsTableProps {
    documents: any[];
    isLoading: boolean;
}

export default function RecentDocumentsTable({ documents, isLoading }: RecentDocumentsTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-[32px] border border-slate-100 p-8">
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-slate-50 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm mt-10">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight">Recent Analysis</h3>
                </div>
            </div>
            {documents.length === 0 ? (
                <div className="p-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-slate-200" />
                    </div>
                    <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No intelligence gathered.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-50">
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12">Knowledge Asset</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12">Depth</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12">Status</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12">Ingested</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12 text-right">Studio</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.slice(0, 5).map((doc) => {
                            const status = statusConfig[doc.status as keyof typeof statusConfig] || statusConfig.processing;
                            const StatusIcon = status.icon;
                            return (
                                <TableRow key={doc._id} className="hover:bg-slate-50/50 border-slate-50 group">
                                    <TableCell className="font-extrabold text-slate-800 px-8 py-5 uppercase text-xs truncate max-w-[200px]">{doc.title}</TableCell>
                                    <TableCell className="px-8 py-5">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-0 text-[9px] uppercase font-black tracking-widest px-2.5 h-6">
                                            {doc.learning_level}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-5">
                                        <Badge variant="outline" className={`${status.class} border-0 rounded-full gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 h-7`}>
                                            <StatusIcon className={`h-3 w-3 ${doc.status === "processing" ? "animate-spin" : ""}`} />
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-[11px] font-bold px-8 py-5 uppercase tracking-tighter">
                                        {doc.createdAt ? format(new Date(doc.createdAt), "MMM d") : "—"}
                                    </TableCell>
                                    <TableCell className="text-right px-8 py-5">
                                        <Link href={`/lesson/${doc._id}`}>
                                            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-100 hover:border-indigo-200 text-slate-400 hover:text-indigo-600 bg-white shadow-sm cursor-pointer transition-all active:scale-95">
                                                <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
