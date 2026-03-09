"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle2, XCircle, RotateCcw, Trophy, Loader2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { getQuizByVideoId, saveQuizResult, generateQuizAction } from "@/app/actions/quizActions";

export default function QuizTab({ video }: { video: any }) {
    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState<any>(null);
    const [generating, setGenerating] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answers, setAnswers] = useState<any[]>([]);
    const [finished, setFinished] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [video._id]);

    const fetchQuiz = async () => {
        setLoading(true);
        const data = await getQuizByVideoId(video._id);
        setQuiz(data);
        setLoading(false);
    };

    const handleGenerate = async () => {
        setGenerating(true);

        // Use video title and slides/topics to inform the AI
        const topics = (video.slides || []).map((s: any) => s.title);

        const result = await generateQuizAction(video._id, video.title, topics);

        if (result.success) {
            setQuiz(result.data);
            resetQuiz();
            toast.success("AI Quiz ready!");
        } else {
            toast.error("Failed to generate AI quiz");
        }
        setGenerating(false);
    };

    const resetQuiz = () => {
        setCurrentQ(0);
        setSelected(null);
        setAnswers([]);
        setFinished(false);
        setShowExplanation(false);
    };

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        setShowExplanation(true);
    };

    const handleNext = async () => {
        const questions = quiz?.questions || [];
        const isCorrect = selected === questions[currentQ].correct_index;
        const newAnswers = [...answers, { question_index: currentQ, selected_index: selected, correct: isCorrect }];
        setAnswers(newAnswers);

        if (currentQ + 1 >= questions.length) {
            const score = newAnswers.filter((a) => a.correct).length;
            await saveQuizResult({
                quiz_id: quiz._id,
                video_id: video._id,
                video_title: video.title,
                score,
                total_questions: questions.length,
                score_pct: Math.round((score / questions.length) * 100),
                answers: newAnswers,
            });
            setFinished(true);
        } else {
            setCurrentQ(currentQ + 1);
            setSelected(null);
            setShowExplanation(false);
        }
    };

    if (loading) return <div className="py-10 flex justify-center"><Loader2 className="h-5 w-5 text-violet-400 animate-spin" /></div>;

    const questions = quiz?.questions || [];
    const score = answers.filter((a) => a.correct).length;

    // Empty state
    if (!quiz || questions.length === 0) {
        return (
            <div className="py-14 text-center">
                <div className="h-16 w-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4 border border-violet-100">
                    <Sparkles className="h-7 w-7 text-violet-400" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-lg uppercase tracking-tight">No quiz yet</h3>
                <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto">Generate AI-powered multiple choice questions from this lesson.</p>
                <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="rounded-2xl h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/30 border-0 cursor-pointer font-bold"
                >
                    {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Build Interactive Quiz
                </Button>
            </div>
        );
    }

    // Finished state
    if (finished) {
        const pct = Math.round((score / questions.length) * 100);
        const grade = pct >= 80 ? "Stellar Performance!" : pct >= 60 ? "Great Job!" : "Keep Reviewing!";
        return (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30">
                    <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight uppercase tracking-tight">{grade}</h3>
                <p className="text-slate-400 mb-8 text-lg">You secured <span className="font-extrabold text-violet-600">{score}/{questions.length}</span> — {pct}%</p>
                <div className="max-w-xs mx-auto mb-10">
                    <Progress value={pct} className="h-3 rounded-full bg-slate-100" />
                </div>
                <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" onClick={resetQuiz} className="rounded-xl h-12 px-6 border-slate-200 text-slate-600 font-semibold cursor-pointer">
                        <RotateCcw className="h-4 w-4 mr-2" /> Try Again
                    </Button>
                    <Button onClick={handleGenerate} disabled={generating} className="rounded-xl h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold border-0 cursor-pointer">
                        <Sparkles className="h-4 w-4 mr-2" /> Refresh Questions
                    </Button>
                </div>
            </motion.div>
        );
    }

    const q = questions[currentQ];
    const optionLetters = ["A", "B", "C", "D"];

    return (
        <div className="py-2">
            <div className="flex items-center justify-between mb-5">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Question {currentQ + 1} of {questions.length}</span>
                <Button variant="ghost" onClick={handleGenerate} disabled={generating} className="h-8 text-xs text-slate-400 gap-1 border-0 bg-transparent cursor-pointer hover:text-slate-600">
                    <RotateCcw className="h-3.3 w-3.5" /> Force Regenerate
                </Button>
            </div>
            <Progress value={((currentQ) / questions.length) * 100} className="h-1.5 rounded-full mb-8" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <p className="text-xl font-bold text-slate-800 mb-8 leading-tight tracking-tight">{q.question}</p>

                    <div className="space-y-3 mb-8">
                        {q.options.map((opt: string, idx: number) => {
                            const isSelected = selected === idx;
                            const isCorrect = idx === q.correct_index;
                            let style = "border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 cursor-pointer";
                            if (selected !== null) {
                                if (isCorrect) style = "border-emerald-500 bg-emerald-50 cursor-default ring-2 ring-emerald-100";
                                else if (isSelected) style = "border-red-500 bg-red-50 cursor-default ring-2 ring-red-100";
                                else style = "border-slate-50 bg-slate-50/30 cursor-default opacity-40 shadow-none";
                            }
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-300 group shadow-sm ${style}`}
                                >
                                    <span className={`h-8 w-8 rounded-xl text-xs font-black flex items-center justify-center flex-shrink-0 transition-all ${selected !== null && isCorrect ? "bg-emerald-500 text-white" :
                                        selected !== null && isSelected ? "bg-red-500 text-white" :
                                            "bg-slate-100 text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600"
                                        }`}>
                                        {optionLetters[idx]}
                                    </span>
                                    <span className="text-[15px] font-semibold text-slate-700 flex-1">{opt}</span>
                                    {selected !== null && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />}
                                    {selected !== null && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {showExplanation && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 overflow-hidden shadow-inner"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Instructor's Note</p>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">{q.explanation}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {selected !== null && (
                        <Button onClick={handleNext} className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 h-14 gap-2 text-white border-0 font-bold shadow-lg shadow-violet-500/20 cursor-pointer hover:shadow-xl transition-all">
                            {currentQ + 1 >= questions.length ? "Finish & Review Score" : "Advance to Next"}
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
