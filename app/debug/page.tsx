import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { headers } from "next/headers";

export default async function DebugPage() {
    const headerList = await headers();
    console.log("🔍 DEBUG PAGE HEADERS:");
    headerList.forEach((val, key) => console.log(`   ${key}: ${val}`));

    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="p-10">
                <h1 className="text-2xl font-bold text-red-500">❌ NO SESSION FOUND</h1>
                <p>You are not logged in.</p>
                <a href="/login" className="underline text-blue-500">Go to Login</a>
            </div>
        );
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold text-green-500">✅ SESSION EXISTS!</h1>
            <p><strong>User:</strong> {session.user?.email}</p>
            <p><strong>Role:</strong> {(session.user as any)?.role}</p>
            <p className="mt-4 text-gray-600">If you see this, Login is working perfectly. The problem is on the Home Page.</p>
        </div>
    );
}
