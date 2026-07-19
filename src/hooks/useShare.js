import { useState } from "react";

export const useShare = () => {
    const [isCopied, setIsCopied] = useState(false);

    const shareContent = async(title, text, url=null) => {
        if(navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url || window.location.origin
                })

                return { success: true, method: "native" }
            } catch (error) {
                console.log("Поширення скасовано або виникла помилка: ", error);
                return { success: false, method: "native" }
            }
        } else {
            try {
                const fullText = url ? `${text}\n\nПосилання: ${url}` : text;
                await navigator.clipboard.writeText(fullText);

                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2500)

                return { success: true, method: "clipboard" }
            } catch (error) {
                console.error("Не вдалось скопіювати текст: ", error);
                return { success: false, method: "clipboard" }
            }
        }
    }

    return { shareContent, isCopied }
}