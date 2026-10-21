export const AVATAR_COLORS = {
        pink: "from-pink-500 to-fuchsia-700",
        purple: "from-purple-500 to-violet-700",
        blue: "from-sky-500 to-blue-700",
        green: "from-green-500 to-emerald-700",
        orange: "from-orange-500 to-amber-600",
        red: "from-rose-500 to-red-700"
    };

export const NOTIFICATION_SETTINGS = [
    { title: "Email-сповіщення", description: "Надсилати сповіщення на пошту", key: "email_notifications" },
    { title: "Нагадування читати", description: "Надсилати щоденні нагадування", key: "reading_reminders" },
    { title: "Рекомендації книг", description: "Рекомендувати книги", key: "book_recommendations" }
];

export const PRIVACY_SETTINGS = [
    { title: "Публічний профіль", description: "Дозволити іншим користувачам бачити ваш профіль", key: "is_public_profile" },
    { title: "Показувати прогрес читання", description: "Відображати поточний прогрес книг", key: "is_show_reading_progress" },
    { title: "Дозволити рекомендації друзям", description: "Отримувати книжкові поради від друзів", key: "allow_friends_recommendations" },
    { title: "Показувати статистику", description: "Відображати годинники читання та графіки", key: "show_statistics" },
    { title: "Показувати книжкову полицю", description: "Відкрити доступ до вашої бібліотеки", key: "show_bookshelf" },
    { title: "Показувати нотатки", description: "Дозволити друзям переглядати ваші нотатки", key: "show_notes" },
    { title: "Показувати цілі", description: "Відображати ваші книжкові цілі", key: "show_goals" },
    { title: "Показувати онлайн-статус", description: "Показувати, коли ви в мережі", key: "show_online_status" }
];