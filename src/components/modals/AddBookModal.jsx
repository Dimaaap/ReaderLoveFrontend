"use client"

import { useAddBookModalStore } from '@/states'
import { ArrowLeft, X } from 'lucide-react';
import { useState } from 'react'
import { ChooseBookOptionSection } from './ChooseBookOptionSection';
import { SearchBookModalSection } from './SearchBookModalSection';
import { AddBookModalSection } from './AddBookModalSection';

export const AddBookModal = () => {

    const [step, setStep] = useState("choose")

    const { setAddBookModalOpen } = useAddBookModalStore();

    const handleClose = () => {
        setAddBookModalOpen(false);
        setStep("choose");
    }

    const handleBack = () => {
        setStep("choose");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-130 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0D0B0C] shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-900 px-6 py-5">
                    <div className="flex items-center gap-3">

                        { step !== "choose" && (
                            <button
                                type="button"
                                onClick={ handleBack }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 
                                transition hover:bg-zinc-800 hover:text-white"
                            >
                                <ArrowLeft size={ 18 } />
                            </button>
                        ) }

                        <h2 className="text-lg font-semibold text-white">
                            { step === "choose" && "Додати книгу" }
                            { step === "search" && "Знайти книгу" }
                            { step === "create" && "Додати книгу вручну" }
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={ handleClose }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition 
                        hover:bg-zinc-900 hover:text-white cursor-pointer"
                    >
                        <X size={ 20 } />
                    </button>
                </div>

                <div className="p-6">
                    { step === "choose" && (
                        <ChooseBookOptionSection setStep={ setStep } />
                    ) }

                    { step === "search" && (
                        <SearchBookModalSection setStep={ setStep } />
                    ) }

                    { step === "create" && (
                        <AddBookModalSection handleClose={ handleClose } />
                    ) }
                </div>
            </div>
        </div>
    )
}
