"use client";

const legendItems = [
    {
        label: "1–5",
        color: "#FFE0A3",
    },
    {
        label: "6–25",
        color: "#FFC66D",
    },
    {
        label: "26–50",
        color: "#FF963E",
    },
    {
        label: "50+",
        color: "#F47732",
    },
];

export default function GlobeLegend() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {legendItems.map((item) => (
                <div
                    key={item.label}
                    className="flex h-9 items-center gap-2 rounded-full border border-[#484441] bg-[#353331] px-3"
                >
                    <span
                        className="h-3 w-3 rounded-[4px]"
                        style={{ backgroundColor: item.color }}
                    />

                    <span className="text-xs font-medium text-[#D5D0CC]">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}