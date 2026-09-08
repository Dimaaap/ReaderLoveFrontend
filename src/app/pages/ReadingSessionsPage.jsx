"use client"

import { Sidebar } from "@/components";
import { ReadingCalendar } from "@/components/shared/ReadingCalendar";
import { withAuth } from "@/components/WithAuth"
import { useAuth } from "@/hooks/useAuth";

function ReadingSessionsContent() {
    const { user } = useAuth()
    
    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden z-20">
            <Sidebar username={ user?.username } />

            <main className="flex-1 h-full overflow-y-auto p-8 text-white">
                <ReadingCalendar />
            </main>
        </div>
    )
}

const ProtectedReadingSessionsPage = withAuth(ReadingSessionsContent);

export default function UserReadingSessionsPage() {
    return <ProtectedReadingSessionsPage />
}