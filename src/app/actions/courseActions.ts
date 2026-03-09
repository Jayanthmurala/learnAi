"use server";

import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import { revalidatePath } from "next/cache";

export async function getCourses() {
    await dbConnect();
    try {
        const courses = await Course.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(courses));
    } catch (error) {
        return [];
    }
}

export async function getCourseById(id: string) {
    await dbConnect();
    try {
        const course = await Course.findById(id).lean();
        return JSON.parse(JSON.stringify(course));
    } catch (error) {
        return null;
    }
}

export async function createCourse(data: any) {
    await dbConnect();
    try {
        const course = await Course.create(data);
        revalidatePath("/courses");
        return { success: true, data: JSON.parse(JSON.stringify(course)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateCourse(id: string, data: any) {
    await dbConnect();
    try {
        const course = await Course.findByIdAndUpdate(id, data, { new: true });
        revalidatePath("/courses");
        return { success: true, data: JSON.parse(JSON.stringify(course)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCourse(id: string) {
    await dbConnect();
    try {
        await Course.findByIdAndDelete(id);
        revalidatePath("/courses");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function upsertCourse(data: any) {
    await dbConnect();
    try {
        const { _id, ...updateData } = data;
        const course = await Course.findByIdAndUpdate(_id, updateData, { upsert: true, new: true });
        revalidatePath("/courses");
        return { success: true, data: JSON.parse(JSON.stringify(course)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
