import Image from "next/image";

export default function BookStatusDropdown({
    bookStatus,
    setBookStatus,
    statusMenuOpen,
    setStatusMenuOpen,
}) {

    const selectStatus = (status) => {
        setBookStatus(status);
        setStatusMenuOpen(false);
    };

    return (
        <div className="relative flex gap-2 items-center mt-3">

            <div className="inline-flex rounded-xl bg-[#FF4B6B] text-white shadow-md">

                <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    className="px-5 py-3 rounded-l-xl hover:bg-[#e03e5c] transition text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                    {bookStatus || "Додати в бібліотеку"}
                </button>

                <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    className="px-3 rounded-r-xl border-l border-white/20 hover:bg-[#e03e5c] transition cursor-pointer"
                >
                    <Image
                        src="/icons/left-chevron.svg"
                        alt=""
                        width={14}
                        height={14}
                        className="-rotate-90"
                    />
                </button>

            </div>

            {statusMenuOpen && (

                <div className="absolute top-14 left-0 w-56 rounded-xl border border-zinc-800 bg-[#1A1719] shadow-2xl py-2 z-20">

                    <button
                        onClick={() => selectStatus("Хочу прочитати")}
                        className="w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800/60 transition flex gap-2 items-center"
                    >
                        <span className="text-[#FF4B6B]">🔖</span>
                        Хочу прочитати
                    </button>

                    <button
                        onClick={() => selectStatus("Прочитано")}
                        className="w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800/60 transition flex gap-2 items-center"
                    >
                        <span className="text-emerald-500">✓</span>
                        Прочитано
                    </button>

                </div>

            )}

            <button className="p-3.5 rounded-xl border border-zinc-900 bg-[#0D0B0C] hover:opacity-80 transition cursor-pointer">

                <Image
                    src="/icons/dots-horizontal.svg"
                    alt=""
                    width={18}
                    height={18}
                />

            </button>

        </div>
    );
}