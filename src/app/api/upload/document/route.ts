import { NextResponse } from "next/server";
import { processDocument } from "@/app/actions/uploadActions";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const result = await processDocument(formData);

        if (result.success) {
            return NextResponse.json({ success: true, data: result.data });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
