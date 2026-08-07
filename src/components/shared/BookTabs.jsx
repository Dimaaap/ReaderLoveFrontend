"use client";

export default function BookTabs({
    activeTab,
    setActiveTab,
}) {
    const tabs = [
        {
            id: "general",
            title: "Загальне",
        },
        {
            id: "reviews",
            title: "Відгуки та оцінки",
        },
    ];

    return (
        <div className="flex gap-6 px-6 border-b border-zinc-900 text-sm font-semibold">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                        pb-3
                        border-b-2
                        transition-colors
                        cursor-pointer
                        ${
                            activeTab === tab.id
                                ? "border-[#FF4B6B] text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }
                    `}
                >
                    {tab.title}
                </button>
            ))}
        </div>
    );
}