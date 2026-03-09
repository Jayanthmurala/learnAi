"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Share2, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface VideoCardProps {
    video: any;
    index?: number;
}

export default function VideoCard({ video, index = 0 }: VideoCardProps) {
    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        const url = window.location.origin + `/video/${video._id}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link href={`/video/${video._id}`} className="block group">
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform group-hover:-translate-y-1">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/5 transition-colors duration-500" />
                        {video.thumbnail_url ? (
                            <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10">
                                <Play className="h-7 w-7 text-violet-600 fill-violet-600 ml-1" />
                            </div>
                        )}
                        {video.duration && (
                            <Badge className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold gap-1.5 border-0 py-1 px-2.5 rounded-lg shadow-lg">
                                <Clock className="h-3 w-3" />
                                {video.duration}
                            </Badge>
                        )}

                        {/* Status Badge Overlay */}
                        <div className="absolute top-4 left-4">
                            <Badge className={`text-[9px] font-black uppercase py-0.5 px-2 border-0 shadow-sm ${video.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                                }`}>
                                {video.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-6">
                        <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight group-hover:text-violet-600 transition-colors">{video.title}</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Generated {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "—"}
                        </p>

                        {/* Premium Action Grid */}
                        <div className="flex items-center gap-3 mt-6">
                            <Button size="sm" className="rounded-2xl h-10 text-xs bg-slate-900 hover:bg-violet-600 text-white font-bold flex-1 border-0 cursor-pointer shadow-lg hover:shadow-violet-200 transition-all">
                                <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
                                Watch Studio
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="rounded-xl h-10 w-10 border-slate-100 bg-slate-50 text-slate-400 hover:text-violet-600 hover:bg-white hover:border-violet-100 transition-all cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (video.video_url) window.open(video.video_url);
                                    }}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="rounded-xl h-10 w-10 border-slate-100 bg-slate-50 text-slate-400 hover:text-violet-600 hover:bg-white hover:border-violet-100 transition-all cursor-pointer"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
