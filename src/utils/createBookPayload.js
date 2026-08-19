import { slugify } from "./slugify"

export const createBookPayload = (data, imageLink) => {
    return {
        isbn: data.isbn || null,
        title: data.title,
        slug: slugify(data.title),
        image_link: imageLink,
        pages_count: Number(data.pages_count),
        description: data.description || null,
        publish_date: data.publish_date || null,
        language: data.language || null,
        authors: data.authors,
        genres: [data.genre],
        publisher: data.publisher
    }
}