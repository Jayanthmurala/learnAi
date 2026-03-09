import { NextResponse } from "next/server";
import { createVideo } from "@/app/actions/videoActions";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const result = await createVideo(data);

        if (result.success) {
            return NextResponse.json({ success: true, data: result.data });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
