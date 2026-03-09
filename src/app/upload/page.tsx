"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Upload, FileText, X, Sparkles, File, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { processDocument } from "../actions/uploadActions";
import { toast } from "react-hot-toast";

const ACCEPTED_TYPES: Record<string, string> = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "text/plain": "txt",
};

const FILE_ICONS: Record<string, string> = {
    pdf: "bg-red-50 text-red-500",
    docx: "bg-blue-50 text-blue-500",
    txt: "bg-slate-50 text-slate-500",
};

export default function UploadDocumentPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [level, setLevel] = useState("intermediate");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFile = (f: File) => {
        const type = ACCEPTED_TYPES[f.type];
        if (!type) {
            toast.error("File type not supported. Please use PDF, DOCX, or TXT.");
            return;
        }
        setFile(f);
        setFileType(type);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleGenerate = async () => {
        if (!file) return;
        setUploading(true);
        setProgress(10);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("learning_level", level);
        formData.append("title", file.name.replace(/\.[^/.]+$/, ""));

        setProgress(40);
        const result = await processDocument(formData);
        setProgress(80);

        if (result.success) {
            setProgress(100);
            toast.success("AI lessons generated!");
            setTimeout(() => {
                router.push(`/lesson/${result.data._id}`);
            }, 500);
        } else {
            setUploading(false);
            setProgress(0);
            toast.error(result.error || "Generation failed");
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-3xl mx-auto min-h-screen">
            <div className="mb-10">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Upload Document
                </h1>
                <p className="text-slate-400 mt-1">
                    Upload a PDF, DOCX, or TXT file to generate AI video lessons.
                </p>
            </div>

            {/* Upload area */}
            <Card
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer p-0 overflow-hidden ${dragActive
                    ? "border-violet-400 bg-violet-50/50"
                    : file
                        ? "border-emerald-300 bg-emerald-50/30"
                        : "border-slate-200 hover:border-violet-300 hover:bg-violet-50/20"
                    }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                <div className="p-10 sm:p-14 text-center">
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="h-16 w-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-5">
                                    <Upload className="h-7 w-7 text-violet-500" />
                                </div>
                                <p className="text-slate-700 font-semibold mb-1">
                                    Drop your document here, or click to browse
                                </p>
                                <p className="text-sm text-slate-400">
                                    Supports PDF, DOCX, and TXT files
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="file"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-4 justify-center"
                            >
                                <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${FILE_ICONS[fileType as string] || "bg-slate-50 text-slate-500"}`}>
                                    <File className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[300px]">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB · {fileType?.toUpperCase()}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                        setFileType(null);
                                    }}
                                    className="ml-2 h-8 w-8 rounded-lg bg-slate-100 hover:bg-red-50 flex items-center justify-center group transition-colors border-0 cursor-pointer"
                                >
                                    <X className="h-4 w-4 text-slate-400 group-hover:text-red-500" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>

            {/* Options */}
            <div className="mt-8 space-y-6">
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Learning Level
                    </label>
                    <Select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </Select>
                </div>

                {/* Progress feedback */}
                <AnimatePresence>
                    {uploading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                {progress < 100 ? (
                                    <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                )}
                                <span className="text-sm font-medium text-slate-700">
                                    {progress < 50
                                        ? "Uploading document…"
                                        : progress < 80
                                            ? "Extracting topics with AI…"
                                            : progress < 100
                                                ? "Generating scripts…"
                                                : "Done!"}
                                </span>
                            </div>
                            <Progress value={progress} className="h-2 rounded-full" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    onClick={handleGenerate}
                    disabled={!file || uploading}
                    className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 disabled:opacity-50 text-white border-0 cursor-pointer"
                >
                    {uploading ? (
                        <>
                            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                            Generating AI Lessons…
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate AI Lessons
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
