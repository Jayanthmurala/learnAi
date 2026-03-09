"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Upload,
    Video,
    Settings,
    Menu,
    X,
    Sparkles,
    LogOut,
    ChevronRight,
    BookOpen,
    BarChart2,
    Crown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Upload Document", icon: Upload, path: "/upload" },
    { name: "My Videos", icon: Video, path: "/videos" },
    { name: "Courses", icon: BookOpen, path: "/courses" },
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
    { name: "Pricing", icon: Crown, path: "/pricing" },
    { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Don't show sidebar on landing page or auth pages
    const isPublicPage = pathname === "/" || pathname.startsWith("/auth") || pathname === "/pricing";

    // Actually, pricing should probably have the sidebar if logged in, but let's keep it clean for now.
    // If user is logged in, show sidebar on pricing too.

    if (isPublicPage && pathname !== "/pricing") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex selection:bg-violet-100 selection:text-violet-900">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Aside */}
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-white border-r border-slate-100 flex flex-col transition-transform duration-300",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100">
                    <Link href="/dashboard" className="flex items-center gap-2.5 cursor-pointer no-underline">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">LearnAI</span>
                    </Link>
                    <button className="ml-auto lg:hidden cursor-pointer border-0 bg-transparent" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer no-underline",
                                    isActive
                                        ? "bg-violet-50 text-violet-700"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600")} />
                                {item.name}
                                {isActive && <ChevronRight className="h-4 w-4 ml-auto text-violet-400" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4 py-6">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-4 shadow-xl shadow-violet-200">
                        <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">Go Unlimited</h4>
                        <p className="text-white/70 text-[10px] leading-relaxed mb-4 font-medium uppercase tracking-wider">
                            Sync 100+ videos. 4K export. Premium voices.
                        </p>
                        <Link
                            href="/pricing"
                            className="bg-white text-violet-700 w-full rounded-xl py-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-slate-50 flex items-center justify-center no-underline"
                        >
                            Upgrade Now
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all w-full cursor-pointer text-left border-0 bg-transparent shadow-none"
                    >
                        <LogOut className="h-[18px] w-[18px]" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Mobile Header */}
                <header className="h-16 flex items-center px-4 lg:px-8 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="cursor-pointer border-0 bg-transparent shadow-none">
                        <Menu className="h-5 w-5 text-slate-600" />
                    </button>
                    <div className="flex items-center gap-2 ml-4">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="font-bold text-sm text-slate-900">LearnAI</span>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
