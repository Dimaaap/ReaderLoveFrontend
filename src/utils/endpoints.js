const BASE_BACKEND_URL = "http://localhost:8030/api/v1"

const SocialLinks = {
    ALL_SOCIAL_LINKS: `${BASE_BACKEND_URL}/social_links/`
}

const Reviews = {
    ALL_REVIEWS: `${BASE_BACKEND_URL}/reviews/`
}

const Books = {
    BOOK_BY_SLUG: (slug) => `${BASE_BACKEND_URL}/books/by-slug/${slug}`,
    USER_ACTIVE_BOOKS: (username) => `${BASE_BACKEND_URL}/books/${username}/books`,
    BOOK_WITH_READ_SESSIONS: (username, bookSlug) => `${BASE_BACKEND_URL}/books/${username}/slug/${bookSlug}`,
    USER_LAST_READING_BOOK: (username) => `${BASE_BACKEND_URL}/books/current-reading/${username}`
}

const Users = {
    REGISTER: `${BASE_BACKEND_URL}/users/auth/register`,
    VERIFY: `${BASE_BACKEND_URL}/users/auth/verify`,
    ME: `${BASE_BACKEND_URL}/users/auth/me`,
    LOGIN: `${BASE_BACKEND_URL}/users/auth/login`,
    LOGIN_WITH_GOOGLE: "http://localhost:8030/api/v1/users/auth/google/callback",
    LOGTIN_WITH_GITHUB: "http://localhost:8030/api/v1/users/auth/github/callback",
    FORGOT_PASSWORD: `${BASE_BACKEND_URL}/users/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_BACKEND_URL}/users/auth/reset-password`
}

const TemporaryQuotes = {
    TODAY_QUOTE: `${BASE_BACKEND_URL}/template_quotes/today`
}

const ReadingSessions = {
    USER_LAST_READING_SESSIONS: (username, limit) => `${BASE_BACKEND_URL}/reading-sessions/by-username?username=${username}&limit=${limit}`,
    CREATE_READING_SESSION: `${BASE_BACKEND_URL}/reading-sessions/`,
    PATCH_READING_SESSION: (sessionId) => `${BASE_BACKEND_URL}/reading-sessions/${sessionId}`
}

const BookNotes = {
    USER_ALL_NOTES_FOR_BOOK: (username, bookId) => `${BASE_BACKEND_URL}/book-notes/by-user-book?username=${username}&book_id=${bookId}`,
    USER_LAST_BOOK_NOTES: (username, limit) => `${BASE_BACKEND_URL}/book-notes/by-username?username=${username}&limit=${limit}`,
    TOGGLE_NOTE_IMPORTANCE: (noteId) => `${BASE_BACKEND_URL}/book-notes/${noteId}/toggle-importance`,
    CREATE_BOOK_NOTE: `${BASE_BACKEND_URL}/book-notes/`,
    PARTIAL_UPDATE_NOTE: (noteId) => `${BASE_BACKEND_URL}/book-notes/${noteId}`,
    DELETE_NOTE: (noteId) => `${BASE_BACKEND_URL}/book-notes/${noteId}`
}

const UserGoals = {
    USER_ALL_GOALS: (username) => `${BASE_BACKEND_URL}/user-goals/by-username?username=${username}`
}

export const AllLinks = {
    socialLinks: SocialLinks,
    reviews: Reviews,
    users: Users,
    books: Books,
    templateQuotes: TemporaryQuotes,
    readingSessions: ReadingSessions,
    bookNotes: BookNotes,
    userGoals: UserGoals
}