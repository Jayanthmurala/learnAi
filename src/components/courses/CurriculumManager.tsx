"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { GripVertical, Play, Plus, Trash2, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { updateCourse } from "@/app/actions/courseActions";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface CurriculumManagerProps {
    course: any;
    allVideos: any[];
}

export default function CurriculumManager({ course, allVideos }: CurriculumManagerProps) {
    const [videoIds, setVideoIds] = useState<string[]>(course.video_ids || []);

    const lessons = videoIds
        .map((id: string) => allVideos.find((v) => v._id === id))
        .filter(Boolean);

    const [isAdding, setIsAdding] = useState(false);
    const [search, setSearch] = useState("");

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(videoIds);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setVideoIds(items);
        const updateResult = await updateCourse(course._id, { video_ids: items });
        if (updateResult.success) {
            toast.success("Curriculum reordered");
        }
    };

    const handleAddVideo = async (videoId: string) => {
        const newIds = [...videoIds, videoId];
        setVideoIds(newIds);
        const result = await updateCourse(course._id, { video_ids: newIds });
        if (result.success) {
            toast.success("Lesson added to series");
        }
    };

    const handleRemoveVideo = async (videoId: string) => {
        const newIds = videoIds.filter(id => id !== videoId);
        setVideoIds(newIds);
        const result = await updateCourse(course._id, { video_ids: newIds });
        if (result.success) {
            toast.success("Lesson decoupled from series");
        }
    };

    const availableVideos = allVideos.filter(v =>
        !videoIds.includes(v._id) &&
        v.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="font-black text-slate-900 uppercase tracking-tight">Curriculum Studio</h2>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-3 h-7 border-slate-200 text-slate-400">
                        {lessons.length} productions
                    </Badge>
                </div>
                <div className="p-6">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="course-lessons">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {lessons.length === 0 ? (
                                        <div className="text-center py-16 px-6 bg-slate-50/50 rounded-[24px] border-2 border-dashed border-slate-100">
                                            <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No productions assigned yet.</p>
                                        </div>
                                    ) : (
                                        lessons.map((video: any, index: number) => (
                                            <Draggable key={video._id} draggableId={video._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <motion.div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={cn(
                                                            "flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-300",
                                                            snapshot.isDragging
                                                                ? "border-violet-300 bg-white shadow-2xl shadow-violet-500/20 scale-[1.02]"
                                                                : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                                                        )}
                                                    >
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="cursor-grab text-slate-300 hover:text-slate-500 transition-colors"
                                                        >
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>
                                                        <span className="h-10 w-10 rounded-xl bg-slate-50 text-slate-900 text-xs font-black flex items-center justify-center flex-shrink-0 border border-slate-100">
                                                            {index + 1}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">
                                                                {video.title}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                                {video.learning_level || 'standard'} depth
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Link href={`/video/${video._id}`}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-widest border-slate-100 text-slate-400 hover:text-violet-600 transition-all cursor-pointer"
                                                                >
                                                                    <Play className="h-3 w-3 mr-1.5 fill-current" /> Preview
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleRemoveVideo(video._id)}
                                                                className="h-9 w-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all border-0 bg-transparent cursor-pointer"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>

            {/* Asset Library for Adding */}
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                            <Plus className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="font-black text-slate-900 uppercase tracking-tight">Intelligence Assets</h2>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="FILTER ASSETS..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl h-9 pl-9 pr-4 text-[9px] font-black uppercase tracking-[0.2em] w-48 focus:outline-none focus:ring-1 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                        />
                    </div>
                </div>
                <div className="p-6">
                    {availableVideos.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No available assets match your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availableVideos.map((video: any) => (
                                <div
                                    key={video._id}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-violet-200 transition-all group"
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">{video.title}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Generated {new Date(video.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <Button
                                        onClick={() => handleAddVideo(video._id)}
                                        size="sm"
                                        className="h-8 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-violet-600 hover:text-white hover:border-violet-600 text-[9px] font-black uppercase tracking-[0.15em] shadow-sm transition-all cursor-pointer"
                                    >
                                        Integrate
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
