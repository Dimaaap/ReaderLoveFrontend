import React from 'react'

export const DeleteSessionConfirm = ({ onConfirm, onCancel }) => {
  return (
    <div className="absolute right-0 top-0 z-20 flex flex-col gap-2 p-3 rounded-lg border border-zinc-800 
    bg-[#161515] shadow-xl text-xs max-w-50">
        <p className="text-zinc-300 font-medium">
            Ви дійсно хочете видалити цю сесію?
        </p>

        <div className="flex gap-2 justify-end">
            <button
                type="button"
                onClick={ onCancel }
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors cursor-pointer"
            >
                Скасувати
            </button>

            <button 
                type="button"
                onClick={ onConfirm }
                className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer">
                    Видалити
            </button>
        </div>
    </div>
  )
}