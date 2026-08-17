"use client";

import { useRef } from "react";
import { ChangeBookCover } from "./ChangeBookCover";
import { AddBookCover } from "./AddBookCover";

export const DownloadBookCover = ({ coverPreview, setCoverFile, setCoverPreview }) => {
    const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024;

    const fileInputRef = useRef(null);

    const handleCoverChange = (event) => {
        const file = event.target.files?.[0];

        if(!file){
            return;
        }

        if(file.size > MAX_COVER_IMAGE_SIZE) {
            alert("Максимальний розмір обкладинки - 5МБ");
            event.target.value = "";
            return;
        }

        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file))
    }
    
    return (
        <div>
            <input 
                ref={ fileInputRef }
                type="file"
                accept="image/jgep,image/png,image/webp"
                className="hidden"
                onChange={(event) => handleCoverChange(event)}
            />
            <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-47.5 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl
            border border-dashed border-zinc-700 bg-[#121011] text-zinc-500 transition hover:border-pink-500/50
            hover:text-pink-400">
                { coverPreview ? (
                    <ChangeBookCover coverPreview={ coverPreview } />
                ) : (
                    <AddBookCover />
                ) }
            </button>
        </div>
    )
}
