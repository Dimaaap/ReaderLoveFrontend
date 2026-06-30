import BookPage from "@/app/pages/BookPage";

export default async function Book({ params }) {
    const { bookSlug } = await params;

    return (
        <BookPage bookSlug={ bookSlug }  />
    )
}