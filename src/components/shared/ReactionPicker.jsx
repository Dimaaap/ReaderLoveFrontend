"use client";

import { useRef, useState, useEffect } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Plus } from "lucide-react";

export function ReactionPicker({ onSelectEmoji }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all cursor-pointer"
        aria-label="Додати реакцію"
      >
        <Plus className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-12 z-50 shadow-2xl rounded-2xl overflow-hidden border border-zinc-700">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={(emojiData) => {
              onSelectEmoji(emojiData.emoji);
              setIsOpen(false);
            }}
            searchPlaceHolder="Пошук емодзі..."
            width={320}
            height={400}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
}