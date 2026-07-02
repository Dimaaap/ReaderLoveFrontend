"use client"

import Image from "next/image"
import Link from "next/link"

import { usePathname } from "next/navigation"

const sidebarLinks = [
    { name: "Головна", icon: "home.svg", link: "" },
    { name: "Бібліотека", icon: "library.svg", link: "library" },
    { name: "Зараз читаю", icon: "book.svg", link: "now-reading" },
    { name: "Статистика", icon: "stats.svg", link: "stats" },
    { name: "Цілі", icon: "target.svg", link: "aims" },
    { name: "Замітки", icon: "notes.svg", link: "notes" },
    { name: "Цитати", icon: "quotes.svg", link: "quotes" },
    { name: "Друзі", icon: "friends.svg", link: "friends" }
]

export const Sidebar = ({ username }) => {
    const pathname = usePathname();
    const meSection = pathname.split('/')[2] || ""

  return (
    <div className="flex flex-col gap-6 w-[16%] border-r border-white/10 h-full bg-[#141113] p-4 text-white sticky top-0">
        <div className="flex items-center gap-2 px-2 py-3 text-center justify-center">
            <span className="text-xl font-bold tracking-wide">
                Reader<span className="text-[#F43F5E]">Love</span>
            </span>
        </div>

        <ul className="w-full flex flex-col gap-1 pb-5 border-b border-white/10">
            {sidebarLinks.map((item) => (
                <Link 
                    key={item.name}
                    className={`flex items-center gap-3 w-full py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200
                        ${item.link === meSection
                            ? "bg-white/10 text-white font-semibold" 
                            : "text-white/60 hover:text-white hover:bg-white/5"}`} 
                    href={`/me/${item.link}`}
                >
                    <Image 
                        src={`/icons/${item.icon}`} 
                        alt="" 
                        width="18" 
                        height="18" 
                        className={item.active ? "opacity-100" : "opacity-60"} 
                    />
                    <span>{item.name}</span>
                </Link>
            ))}
        </ul>

        <ul className="w-full flex flex-col gap-1 pb-5 border-b border-white/10">
            <Link className="flex items-center gap-3 w-full py-2 px-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors" href="#">
                <Image src="/icons/settings.svg" alt="" width="18" height="18" className="opacity-60" />
                <span>Налаштування</span>
            </Link>

            <Link className="flex items-center gap-3 w-full py-2 px-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors" href="#">
                <Image src="/icons/log-out.svg" alt="" width="18" height="18" className="opacity-60" />
                <span>Вийти</span>
            </Link>
        </ul>
        <Link className="flex items-center justify-between mt-auto p-2 hover:bg-white/5 rounded-xl transition-colors group" href="#">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#F43F5E] to-purple-600 flex items-center justify-between overflow-hidden border border-white/20">
                    <span className="text-xs font-bold mx-auto uppercase">{username.substring(0, 2)}</span>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-white tracking-wide truncate max-w-22.5">
                        {username}
                    </p>
                    <p className="text-[11px] font-medium text-white/40 group-hover:text-white/60 transition-colors">
                        Мій профіль
                    </p>
                </div>
            </div>

            <Image 
                src="/icons/arrow-right.svg" 
                alt="" 
                width="14" 
                height="14" 
                className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" 
            />
        </Link>
    </div>
  )
}