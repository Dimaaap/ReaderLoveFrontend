import BookGenrePage from "@/app/pages/BookGenrePage";

export default async function GenrePage({ params }) {
    const { genreSlug } = await params;

    return (
        <BookGenrePage genreSlug={ genreSlug } />
    )
}