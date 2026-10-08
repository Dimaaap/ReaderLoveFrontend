export function getSessionDurationInMinutes(session) {
  if (!session?.started_at || !session?.ended_at) return 0;
  
  const start = new Date(session.started_at);
  const end = new Date(session.ended_at);
  const durationInMs = end - start;

  if (isNaN(durationInMs) || durationInMs <= 0) return 0;

  return Math.max(1, Math.round(durationInMs / (1000 * 60)));
}


export function getSessionPagesRead(session) {
  if (typeof session?.end_page !== "number" || typeof session?.start_page !== "number") {
    return 0;
  }
  return Math.max(0, session.end_page - session.start_page);
}

export function calculateReadingTempo(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return {
      pagesPerHour: 0,
      minutesPerPage: 0,
      pagesPerMinute: 0,
      formattedTempo: "0 ст/год",
    };
  }

  const { totalPages, totalMinutes } = sessions.reduce(
    (acc, session) => {
      acc.totalPages += getSessionPagesRead(session);
      acc.totalMinutes += getSessionDurationInMinutes(session);
      return acc;
    },
    { totalPages: 0, totalMinutes: 0 }
  );

  if (totalPages <= 0 || totalMinutes <= 0) {
    return {
      pagesPerHour: 0,
      minutesPerPage: 0,
      pagesPerMinute: 0,
      formattedTempo: "0 ст/год",
    };
  }

  const pagesPerMinute = totalPages / totalMinutes;
  const pagesPerHour = Math.round(pagesPerMinute * 60);
  const minutesPerPage = Math.round((totalMinutes / totalPages) * 10) / 10;

  return {
    pagesPerHour,
    minutesPerPage,
    pagesPerMinute: Math.round(pagesPerMinute * 100) / 100,
    formattedTempo: `${pagesPerHour} ст/год`,
  };
}


export function getSingleSessionTempoStats(session, averagePagesPerHour) {
  const pagesRead = getSessionPagesRead(session);
  const durationMinutes = getSessionDurationInMinutes(session);

  if (!pagesRead || !durationMinutes || durationMinutes <= 0) {
    return {
      pagesPerHour: 0,
      minutesPerPage: 0,
      formattedTempo: "0 ст/год",
      diffPercent: 0,
      status: "neutral"
    }
  }

  const pagesPerMinute = pagesRead / durationMinutes;
  const pagesPerHour = Math.round(pagesPerMinute * 60);
  const minutesPerPage = Math.round((durationMinutes / pagesRead) * 10) / 10;

  if (!averagePagesPerHour || averagePagesPerHour <= 0) {
    return {
      pagesPerHour,
      minutesPerPage,
      formattedTempo: `${pagesPerHour} ст/год`,
      diffPercent: 0,
      status: "neutral"
    }
  }

  let diffPercent = Math.round(((pagesPerHour - averagePagesPerHour) / averagePagesPerHour) * 100);

  let status = "neutral";

  if (diffPercent >= 5) {
    status = "faster";
  } else if (diffPercent <= -5) {
    status = "slower";
  }

  return {
    pagesPerHour,
    minutesPerPage,
    formattedTempo: `${pagesPerHour} ст/год`,
    diffPercent,
    status
  }
}