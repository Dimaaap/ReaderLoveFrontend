import Link from 'next/link'
import React from 'react'

const TABS = [
  {
    title: "Читають зараз",
    slug: "friends"
  },
  {
    title: "Підписки",
    slug: "subsribes"
  },
  {
    title: "Челенджі",
    slug: "challenges"
  },
  {
    title: "Добірки",
    slug: "sets"
  }
]


export const MePageTabs = ({ setter, activeTab }) => {
    return (
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
          {TABS.map((tab) => (
            <Link
              key={tab.slug}
              href={`/me/${tab.slug}`}
              onClick={() => setter(tab.title)}
              className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.title
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              {tab.title}
            </Link>
          ))}
        </div>
    )
}
