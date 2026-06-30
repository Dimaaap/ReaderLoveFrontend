const BASE_BACKEND_URL = "http://localhost:8030/api/v1"

const SocialLinks = {
    ALL_SOCIAL_LINKS: `${BASE_BACKEND_URL}/social_links/`
}

const Reviews = {
    ALL_REVIEWS: `${BASE_BACKEND_URL}/reviews/`
}

const Books = {
    BOOK_BY_SLUG: (slug) => `${BASE_BACKEND_URL}/books/by-slug/${slug}`
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

export const AllLinks = {
    socialLinks: SocialLinks,
    reviews: Reviews,
    users: Users,
    books: Books
}