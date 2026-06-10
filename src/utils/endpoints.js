const BASE_BACKEND_URL = "http://localhost:8030/api/v1"

const SocialLinks = {
    ALL_SOCIAL_LINKS: `${BASE_BACKEND_URL}/social_links/`
}

const Reviews = {
    ALL_REVIEWS: `${BASE_BACKEND_URL}/reviews/`
}

const Users = {
    REGISTER: `${BASE_BACKEND_URL}/users/auth/register`,
    VERIFY: `${BASE_BACKEND_URL}/users/auth/verify`
}

export const AllLinks = {
    socialLinks: SocialLinks,
    reviews: Reviews,
    users: Users
}