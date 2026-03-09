import { NextResponse } from "next/server";
import { updateDocumentLessons } from "@/app/actions/documentActions";

export async function POST(req: Request) {
    try {
        const { id, lessons } = await req.json();
        const result = await updateDocumentLessons(id, lessons);

        if (result.success) {
            return NextResponse.json({ success: true, data: result.data });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
