"use server";

import dbConnect from "@/lib/mongoose";
import TeamMember from "@/models/TeamMember";
import Webhook from "@/models/Webhook";
import { revalidatePath } from "next/cache";

// Team
export async function getTeamMembers() {
    await dbConnect();
    try {
        const members = await TeamMember.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        return [];
    }
}

export async function inviteTeamMember(data: any) {
    await dbConnect();
    try {
        const member = await TeamMember.create(data);
        revalidatePath("/settings");
        return { success: true, data: JSON.parse(JSON.stringify(member)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function removeTeamMember(id: string) {
    await dbConnect();
    try {
        await TeamMember.findByIdAndDelete(id);
        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// Webhooks
export async function getWebhooks() {
    await dbConnect();
    try {
        const hooks = await Webhook.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(hooks));
    } catch (error) {
        return [];
    }
}

export async function createWebhook(data: any) {
    await dbConnect();
    try {
        const hook = await Webhook.create(data);
        revalidatePath("/settings");
        return { success: true, data: JSON.parse(JSON.stringify(hook)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
