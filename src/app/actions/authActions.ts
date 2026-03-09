"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function registerUser(formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const name = formData.get("name") as string;

        if (!email || !password) {
            return { error: "Email and password are required" };
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: "User already exists with this email" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
        });

        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { error: error.message || "Failed to register user" };
    }
}
