import { useEffect, useState } from "react";

const formatDuration = (startIso, endIso) => {
  if (!startIso) return "";

  const startTime = new Date(startIso).getTime();
  const endTime = endIso ? new Date(endIso).getTime() : new Date().getTime();
  const diffInSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000))

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60

  if (hours > 0) {
    return `${hours} год ${minutes.toString().padStart(2, "0")} хв ${seconds.toString().padStart(2, "0")} с`
  } else if (minutes > 0) {
    return `${minutes} хв ${seconds.toString().padStart(2, "0")} с`
  } else {
    return `${seconds} с`
  }
}

export const useSessionTimer = (startedAt, endedAt, isActive) => {
    const [duration, setDuration] = useState("")

    useEffect(() => {
        if (!startedAt) return;

        if (isActive) {
            const updateTimer = () => setDuration(formatDuration(startedAt))
            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval)
        } else {
            setDuration(formatDuration(startedAt, endedAt))
        }
    }, [isActive, startedAt, endedAt])

    return duration;
}