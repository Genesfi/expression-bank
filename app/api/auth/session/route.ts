import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/utils/supabaseServer";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sb-access-token")?.value;

        if (!accessToken) {
            return NextResponse.json({ session: null });
        }

        const { data: { user }, error } = await supabaseServer.auth.getUser(accessToken);

        if (error || !user) {
            return NextResponse.json({ session: null });
        }

        return NextResponse.json({ session: { user } });
    } catch {
        return NextResponse.json({ session: null });
    }
}
