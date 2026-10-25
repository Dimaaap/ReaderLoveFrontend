"use client";

import Image from "next/image";

export const SupportModal = ({ isOpen, onClose }) => {
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="p-6 rounded-xl border border-zinc-900 w-full max-w-xl bg-[#121111]">
                <div className="flex w-full items-center justify-between border-b pb-3 mb-4 border-white/29">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white">
                            Підтримка та FAQ
                        </h3>
                        <p className="text-sm font-semibold text-zinc-300">
                            Відповіді та часті запитання та допомога
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

                <div className="overflow-y-auto flex flex-col gap-4 pr-1 text-zinc-300 text-sm">
                    <div className="flex flex-col gap-1.5 pb-3 border-b border-zinc-800">
                        <h4 className="font-bold text-white">📖 Як експортувати свої нотатки?</h4>
                        <p className="text-zinc-400">
                            Перейдіть у налаштування бібліотеки або профіль, виберіть розділ експорту цитат, 
                            вкажіть зручний формат (CSV, JSON або PDF) та натисніть кнопку завантаження.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5 pb-3 border-b border-zinc-800">
                        <h4 className="font-bold text-white">🎯 Як працюють читацькі цілі?</h4>
                        <p className="text-zinc-400">
                            Ви можете встановлювати кількість прочитаних книг або сторінок на рік/місяць, а 
                            додаток автоматично відстежуватиме ваш прогрес.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5 pb-3">
                        <h4 className="font-bold text-white">
                            💬 Потрібна додаткова допомога?
                        </h4>
                        <p className="text-zinc-400">
                            Якщо ви знайшли помилку або маєте пропозиції щодо покращення платформи, пишіть нам на пошту підтримки 
                            або в Telegram-канал проєкту.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end pt-4 mt-4 border-t border-white/10">
                    <button
                        type="button"
                        className="text-white font-semibold text-md rounded-xl bg-[#ff3b69] hover:bg-[#e0345c] transition-all 
                        duration-200 py-2 px-5 cursor-pointer"
                        onClick={ onClose }
                    >
                        Зрозуміло
                    </button>
                </div>
            </div>
        </div>
    )
}
