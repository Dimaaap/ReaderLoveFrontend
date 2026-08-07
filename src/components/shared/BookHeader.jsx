import Image from 'next/image';

export function BookHeader({ book }) {
    return (
        <div className="flex items-center justify-between border-b border-zinc-900 p-6">

            <div className="flex items-center gap-5">

                <button
                    className="p-2.5 rounded-xl bg-[#0D0B0C] hover:opacity-80 transition duration-200 cursor-pointer"
                    type="button"
                >
                    <Image
                        src="/icons/left-chevron.svg"
                        alt="Back"
                        width={20}
                        height={20}
                    />
                </button>

                <h1 className="text-lg font-semibold tracking-wide text-zinc-200">
                    {book.title}
                </h1>

            </div>

        </div>
    );
}
