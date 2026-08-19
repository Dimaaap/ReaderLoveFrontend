import { AllLinks } from "../utils/endpoints";
import { fetcher } from "../utils/fetcher"
import { createBookPayload } from "../utils/createBookPayload";

export const useCreateBook = () => {
    const createBook = async ({ data, coverFile }) => {
        let imageLink = null;

        if (coverFile) {
            const formData = new FormData();

            formData.append("file", coverFile);

            const uploadResponse = await fetch(
                AllLinks.books.UPLOAD_COVER,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!uploadResponse.ok) {
                throw new Error(
                    "Не вдалось завантажити обкладинку"
                );
            }

            const uploadData = await uploadResponse.json();
            console.log("6. uploadData:", uploadData);

            imageLink = uploadData.image_link;
        }


        const bookData = createBookPayload(
            data,
            imageLink
        );

        console.log(bookData)

         const response = await fetcher(
            AllLinks.books.CREATE_BOOK,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData),
            }
        );

        return response
    };

    const addBookToLibrary = async ({ username, bookSlug }) => {
        return fetcher(
            AllLinks.books.UPDATE_USER_BOOK_READING_STATUS(username, bookSlug),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "want_to_read",
                    last_read_page: 0
                })
            }
        )
    }

    return {
        createBook,
        addBookToLibrary
    };
};