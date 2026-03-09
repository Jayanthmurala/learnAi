import React from "react";
import SettingsClient from "@/components/settings/SettingsClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTeamMembers, getWebhooks } from "../actions/settingsActions";

export const metadata = {
    title: "Settings | LearnAI",
    description: "Configure your AI Studio workspace accounts and integrations.",
};

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    const initialMembers = await getTeamMembers();
    const initialHooks = await getWebhooks();

    return (
        <div className="min-h-screen">
            <SettingsClient
                user={session?.user}
                initialMembers={initialMembers}
                initialHooks={initialHooks}
            />
        </div>
    );
}
