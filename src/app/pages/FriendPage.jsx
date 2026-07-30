"use client"

import { withAuth } from "@/components/WithAuth"
import { usePathname } from "next/navigation"

function FriendContent() {
    const pathname = usePathname()

    const userId = pathname.split("/")[2]

    return (
        <div>
            { userId }
        </div>
    )
}

const ProtectedPage = withAuth(FriendContent)

export default function UserPersonalPage() {
    return <ProtectedPage />
}