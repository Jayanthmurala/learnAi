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
import { Eye, Download, Clock, CheckCircle2, Loader2, AlertCircle, PlayCircle } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
    completed: { label: "Completed", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    processing: { label: "Assembling", icon: Loader2, class: "bg-amber-50 text-amber-700 border-amber-200" },
    failed: { label: "Failed", icon: AlertCircle, class: "bg-red-50 text-red-700 border-red-200" },
};

interface RecentVideosTableProps {
    videos: any[];
    isLoading: boolean;
}

export default function RecentVideosTable({ videos, isLoading }: RecentVideosTableProps) {
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
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
                        <PlayCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight">Recent Productions</h3>
                </div>
            </div>
            {videos.length === 0 ? (
                <div className="p-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-slate-200" />
                    </div>
                    <p className="text-sm font-black text-slate-300 uppercase tracking-widest">The studio is quiet.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-50">
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12">Production Title</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12">Origin</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12">Status</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12">Released</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8 h-12 text-right">Vault</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.map((video) => {
                            const status = statusConfig[video.status as keyof typeof statusConfig] || statusConfig.processing;
                            const StatusIcon = status.icon;
                            return (
                                <TableRow key={video._id} className="hover:bg-slate-50/50 border-slate-50 group">
                                    <TableCell className="font-extrabold text-slate-800 px-8 py-5 uppercase text-xs truncate max-w-[200px]">{video.title}</TableCell>
                                    <TableCell className="text-slate-400 px-8 py-5 text-xs font-bold italic truncate max-w-[150px]">
                                        {video.document_title || "Direct Prompt"}
                                    </TableCell>
                                    <TableCell className="px-8 py-5">
                                        <Badge variant="outline" className={`${status.class} border-0 rounded-full gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 h-7`}>
                                            <StatusIcon className={`h-3 w-3 ${video.status === "processing" ? "animate-spin" : ""}`} />
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-[11px] font-bold px-8 py-5 uppercase tracking-tighter">
                                        {video.createdAt ? format(new Date(video.createdAt), "MMM d") : "—"}
                                    </TableCell>
                                    <TableCell className="text-right px-8 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/video/${video._id}`}>
                                                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-100 hover:border-violet-200 text-slate-400 hover:text-violet-600 bg-white shadow-sm cursor-pointer transition-all active:scale-95">
                                                    <Eye className="h-3.5 w-3.5 mr-1.5" /> Watch
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-200 hover:text-indigo-500 hover:bg-indigo-50 border-0 bg-transparent cursor-pointer transition-colors">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
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
