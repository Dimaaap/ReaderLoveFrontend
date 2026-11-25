export const CALENDAR_THEMES = [
    {
        id: "rork",
        title: "Rork",
        description: "Тваринки, природа й знайомі персонажі.",
        emojis: ["🦕", "🦭", "🦔", "🐼", "🦢"]
    },
    {
        id: "quiet_garden",
        title: "Тихий сад",
        description: "Квіти, зелень і трохи сонця.",
        emojis: ["🌷", "🌸", "🌻", "🌼", "💐"]
    },
    {
        id: "ocean",
        title: "Океан",
        description: "Морські мешканці й солоне повітря.",
        emojis: ["🐋", "🐬", "🐙", "🐠", "🪼"]
    },
    {
        id: "space",
        title: "Космос",
        description: "Маленький всесвіт між сторінками",
        emojis: ["🪐", "🚀", "🌌", "🧑‍🚀", "🛰️"]
    },
    {
        id: "cozy",
        title: "Затишок",
        description: "Теплі дрібнички для свого куточка",
        emojis: ["🫖", "☕", "📚", "🧶", "🕯️"]
    },
    {
        id: "halloween",
        title: "Геловін",
        description: "Гарбузи, солодощі й трохи магії.",
        emojis: ["🎃", "🦇", "🐈‍⬛", "🔮", "🪄"]
    },
    {
        id: "classic_rork",
        title: "Класичний Rork",
        description: "Ті самі емоджі. Той самий характер.",
        emojis: ["🙂", "👀", "🤔", "🤗", "🙈"]
    }
]

export const DEFAULT_CALENDAR_SETTINGS = {
    themeId: "rork",
    bookOrder: "last_read",
    showBadges: true
}

export function getReadingDurationColorClass(seconds=0) {
    const minutes = Math.floor(seconds / 60)

    if (minutes < 10) return "text-amber-400";
    if (minutes < 30) return "text-purple-400";
    if (minutes < 60) return "text-blue-400";

    return "text-emerald-400"
}

export function getDayEmoji(dayNumber, themeId = "rork") {
  const theme =
    CALENDAR_THEMES.find((t) => t.id === themeId) || CALENDAR_THEMES[0];
  return theme.emojis[dayNumber % theme.emojis.length];
}