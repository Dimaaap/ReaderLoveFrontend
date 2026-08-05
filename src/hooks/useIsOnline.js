import { useEffect, useState } from "react";
import { AllLinks } from "../utils/endpoints"


export function usePresence(userId) {

    const [isOnline, setIsOnline] = useState(false)

    useEffect(() => {

        if(!userId) {
            setIsOnline(false)
            return
        }
        
        const wsUrl = AllLinks.webSockets.userOnline(userId)
        console.log("Connectring to WS URL: ", wsUrl)
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
            setIsOnline(true)
        }

        ws.onerror = (error) => {
            setIsOnline(false)
        }

        ws.onclose = () => {
            setIsOnline(false)
        }

        return () => {
            if(ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close()
            }
        }
    }, [userId])

    return isOnline
}