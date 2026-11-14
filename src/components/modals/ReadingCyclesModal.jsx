"use client";

import { useState } from "react";

import { getDeclension } from '@/utils/declension';
import { Trash2, X, ListFilter, AlignLeft } from 'lucide-react';

export const ReadingCyclesModal = ({ isOpen, onClose, cycles=[], onSelectCycle, onDeleteCycle }) => {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState("brief")
    
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 
        backdrop-blur-xs p-0 sm:p-4">
            <div className="w-full max-w-lg bg-[#181517] border border-zinc-800 rounded-t-2xl sm:rounded-2xl 
            p-6 flex flex-col gap-5 shadow-2xl text-zinc-200">

                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 className="text-lg font-semibold text-white">
                        Всі читання
                    </h3>
                    <button onClick={ onClose } className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 
                    transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                    <button
                        onClick={() => setActiveTab("brief")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm 
                        font-semibold rounded-lg transition-all cursor-pointer 
                        ${ activeTab === "brief" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-400 hover:text-white" }`}
                    >
                        <ListFilter className="w-4 h-4" />
                        <span>Стисло</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("detailed")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm
                        font-semibold rounded-lg transition-all cursor-pointer 
                        ${activeTab === "detailed" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-400 hover:text-white"}`}
                    >
                        <AlignLeft className="w-4 h-4" />
                        <span>Деталі</span>
                    </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
                    { cycles.map((cycle) => {
                        const isCurrent = cycle.status === "in_progress";

                        return (
                            <div
                                key={ cycle.id }
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer 
                                ${ isCurrent && activeTab === "detailed" 
                                ? "bg-zinc-800/90 border-zinc-600" 
                                : "bg-[#141113] border-zinc-800/80 hover:bg-zinc-800/50" }`}
                                onClick={async () => {
                                    await onSelectCycle(cycle.id);
                                    onClose();
                                }}
                            >   
                                { activeTab === "brief" && (
                                    <div className="flex items-center gap-3.5 w-full">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                        ${ isCurrent ? "border-blue-500 bg-blue-500 text-white" : "border-zinc-500 bg-transparent" }`}>
                                            { isCurrent && <div className="w-2 h-2 bg-white rounded-full" /> }
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <span className="text-sm font-semibold text-white">
                                                Читання { cycle.read_number }
                                            </span>
                                            <span className="text-xs text-zinc-400 mt-0.5">
                                                { isCurrent ? "Читаю зараз" : "Прочитані" }
                                                { cycle.last_read_percent ? ` · ${cycle.last_read_percent}%` : "· Жовтень" }
                                            </span>
                                        </div>
                                    </div>    
                                ) }

                                { activeTab === "detailed" && (
                                    <>
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-3 h-3 rounded-full shrink-0 ${
                                                isCurrent ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-zinc-600"
                                            }`} />

                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-semibold text-white leading-snug">
                                                    Читання { cycle.read_number } · {isCurrent ? "Читаю зараз" : "Прочитані"}
                                                </span>

                                                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                                                    <span>
                                                        {cycle.started_at ? new Date(cycle.started_at).toLocaleDateString() : "Початок"}
                                                        {cycle.finished_at ? ` — ${new Date(cycle.finished_at).toLocaleDateString()}` : ""}
                                                    </span>
                                                    <span>·</span>
                                                    <span>
                                                        {cycle.sessions_count ?? 0} {getDeclension(cycle.sessions_count ?? 0, ["запис", "записи", "записів"])}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteCycle(cycle.id)
                                            }}
                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg
                                            transition-colors cursor-pointer shrink-0"
                                            title="Видалити цикл"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                ) }
                            </div>
                        )
                    }) }
                </div>
            </div>
        </div>
    )
}
