"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AllLinks } from "@/utils"

export const WhatsNewModal = ({ isOpen, onClose }) => {
    const [changelogData, setChangelogData] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            fetchChangelog()
        }
    }, [isOpen])

    const fetchChangelog = async () => {
        try {
            setLoading(true)
            const response = await fetch(AllLinks.changelog.GET_CHANGELOG);

            if(!response.ok) {
                throw new Error("Помилка завантаження changelog")
            }

            const data = await response.json();
            setChangelogData(data);
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="p-6 bg-[#121111] rounded-xl border border-zinc-900 w-full max-w-xl max-h-[80vh] flex flex-col">
                <div className="flex w-full items-center justify-between border-b pb-3 mb-4 border-white/20">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white">
                            Що нового
                        </h3>
                        <p className="text-sm font-semibold text-zinc-300">
                            Історія оновлень та покращень платформи
                        </p>
                    </div>

                    <button
                        type="button"
                        className="cursor-pointer transition-all duration-200 hover:opacity-80"
                        onClick={ onClose }
                    >
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <div className="overflow-y-auto flex flex-col gap-6 pr-1 custom-scrollbar">
                    { loading ? (
                        <p className="text-center text-zinc-400 py-8">Завантаження оновлень...</p>
                    ) : changelogData.length === 0 ? (
                        <p className="text-center text-zinc-400 py-8">Поки що немає записів про оновлення.</p>
                    ) : (
                        changelogData.map((release, index) => (
                            <div key={ index } className="flex flex-col gap-3 pb-5 border-b border-zinc-800 last:border-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-md font-bold text-[#ff3b69]">
                                        Версія { release.version }
                                    </span>
                                    <span className="text-xs text-zinc-500">
                                        { release.data }
                                    </span>
                                </div>

                                <p className="text-sm font-semibold text-white">
                                    { release.highlights }
                                </p>

                                <ul className="flex flex-col gap-2 mt-1">
                                    {release.changes.map((change, cIndex) => (
                                        <li key={cIndex} className="flex items-start gap-2 text-sm text-zinc-300">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                                                change.type === 'new' 
                                                    ? 'bg-[#ff3b69]/20 text-[#ff3b69]' 
                                                    : 'bg-zinc-800 text-zinc-300'
                                            }`}>
                                                {change.type === 'new' ? 'Нове' : 'Покращення'}
                                            </span>
                                            <span>{change.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) }
                </div>
                <div className="flex items-center justify-end pt-4 mt-2 border-t border-white/10">
                    <button
                        type="button"
                        className="text-white font-semibold text-md rounded-xl bg-[#ff3b69] hover:bg-[#e0345c] transition-all 
                        duration-200 py-2 px-5 cursor-pointer"
                        onClick={onClose}
                    >
                        Зрозуміло
                    </button>
                </div>
            </div>
        </div>
    )
}
