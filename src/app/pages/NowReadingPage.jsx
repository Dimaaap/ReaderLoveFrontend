"use client"

import { Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth";
import Image from "next/image";
import Link from "next/link";

 function NowReadingContent () {
  const genres = [
    {
      "title": "Драма",
      "slug": "drama"
    }
  ]

  const getReadingStats = (readCount, totalCount) => {
    return (readCount / totalCount) * 100
  }

  return (
      <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden">
          <Sidebar username="Dima" />
          <main className="flex-1 h-full overflow-y-auto p-8 text-white flex justify-between">
            <div className="flex flex-col gap-5">
              <h1 className="text-2xl font-bold text-white">
                Зараз читаю
              </h1>  

              <div className="flex gap-5 items-start mt-2 p-6">
                    <div className="w-30 aspect-2/3 relative rounded-xl overflow-hidden shadow-lg border border-zinc-800/40 
                    shrink-0">
                        <Image
                            src="/1984.jpg"
                            alt="Дюна"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                        <h1 className="text-md font-bold text-white tracking-tight leading-tight">Дюна</h1>
                        <p className="text-md text-zinc-500 font-semibold mb-2">
                            {"J.R.R. Tolkien"}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3 text-sm">
                            { genres.map((genre, id) => (
                                <Link href={ genre.slug } key={ id }
                                className="px-2.5 py-1 text-md font-semibold rounded-md bg-[#0D0B0C] 
                                text-zinc-400 border border-zinc-900 hover:border-zinc-900 hover:underline 
                                transition-all duration-200">
                                    { genre.title }
                                </Link>
                            )) }
                        </div>

                        <div className="flex flex-col gap-2 mt-1">
                            <div className="flex justify-between text-md font-semibold text-zinc-400">
                                <span>Прогрес</span>
                                <span className="text-zinc-200">62%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#141113] rounded-full overflow-hidden">
                                <div className="h-full bg-[#FF4B6B] rounded-full" style={{ width: '62%' }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1 mt-3 bg-[#0D0B0C] p-3 rounded-xl border border-zinc-900 text-center text-xs w-full">
                            <div className="flex flex-col gap-2">
                                <span className="block text-zinc-500 font-medium uppercase tracking-wider">Прочитано</span>
                                <span className="text-xs font-bold text-white mt-0.5 block">186 / 296</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="bloc text-zinc-500 font-medium uppercase tracking-wider">Залишилось сторінок</span>
                                <span className="text-xs font-bold text-white mt-0.5 block">110</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="block text-zinc-500 font-medium uppercase tracking-wider">Прогнозоване закічнення</span>
                                <span className="text-xs font-bold text-white mt-0.5 block">24 Травня</span>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center mt-3">
                            <button className="py-3 px-4 bg-[#FF4B6B] hover:bg-[#e03f5d] transition-colors text-white font-semibold text-md rounded-xl 
                            tracking-wide shadow-md shadow-[#FF4B6B]/10 active:scale-[0.98] cursor-pointer">
                                Продовжити читання
                            </button>
                            <button className="p-4 bg-[#0D0B0C] cursor-pointer border border-zinc-900 rounded-xl hover:opacity-80 transition">
                                <Image src="/icons/bookmark.svg" alt="Bookmark" width="18" height="18" className="opacity-80" />
                            </button>
                            <button className="p-4 bg-[#0D0B0C] border border-zinc-900 rounded-xl hover:opacity-80 transition cursor-pointer">
                                <Image src="/icons/dots-horizontal.svg" alt="More" width="18" height="18" className="opacity-80" />
                            </button>
                        </div>
                    </div>
              </div>

              <div className="flex flex-col gap-5">
                <h2 className="text-2xl text-white font-bold">
                  Ваш прогрес
                </h2>

                <div className="grid grid-cols-3 gap-10">
                  <div className="w-full bg-[#141113] rounded-xl flex flex-col gap-2 p-4 relative h-[15vh]">
                    <p className="text-zinc-200 font-semibold text-md">
                      Ваша серія
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl text-white font-bold">
                        12
                      </span>
                      <span className="text-zinc-200 font-semibold text-md">
                        днів
                      </span>
                    </div>
                    <Image src="/icons/fire.svg" alt="Fire" width="40" height="40" className="absolute bottom-1 right-5" />
                  </div>

                  <div className="w-full bg-[#141113] rounded-xl flex flex-col gap-2 p-4 relative h-[15vh]">
                    <p className="text-zinc-200 font-semibold text-md">
                      Цього тижня
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl text-white font-bold">
                        124
                      </span>
                      <span className="text-zinc-200 font-semibold text-md">
                        сторінки
                      </span>
                    </div>
                    <Image src="/icons/stats-reading.svg" alt="Fire" width="40" height="40" className="absolute bottom-1 right-5" />
                  </div>

                  <div className="w-full bg-[#141113] rounded-xl flex flex-col gap-2 p-4 relative h-[15vh]">
                    <p className="text-zinc-200 font-semibold text-md">
                      Ваша ціль
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl text-white font-bold">
                        22
                      </span>
                      <span className="text-zinc-200 font-semibold text-md">
                        / 30 сторінок
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#0D0B0C] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF4B6B] rounded-full" style={{ width: `${getReadingStats(22, 30)}%` }}></div>
                    </div>
                  </div>
                </div>  
              </div>
            </div>
            

            <div className="w-[30%] flex flex-col gap-25">
              <div className="flex flex-col gap-5 bg-[#141113] h-fit p-2 px-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold">
                    Недавні сесії
                  </h4>

                  <Link className="border border-zinc-900 p-2 rounded-2xl flex items-center gap-3 text-sm font-normal cursor-pointer 
                  transition-all duration-300 hover:opacity-80" href="/reading-sessions">
                    Переглянути всі
                    <Image src="/icons/right-chevron.svg" alt="Right" width="16" height="16" />
                  </Link>
                </div>

                <div className="flex items-center gap-5">
                  <Image src="/icons/night.svg" alt="Night" width="30" height="30" />
                  <div className="flex flex-col align-start gap-0 text-md text-zinc-400 font-medium">
                      <span>
                        Сьогодні, 20:30
                      </span>
                      <span className="flex items-center gap-3">
                        <span>
                          22 хв      
                        </span>
                        <div className="w-0.75 h-0.75 rounded-full bg-zinc-400"></div>
                        <span>
                          23 сторінки
                        </span>
                      </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <Image src="/icons/day.svg" alt="Night" width="30" height="30" />
                  <div className="flex flex-col align-start gap-0 text-md text-zinc-400 font-medium">
                      <span>
                        Сьогодні, 20:30
                      </span>
                      <span className="flex items-center gap-3">
                        <span>
                          22 хв      
                        </span>
                        <div className="w-0.75 h-0.75 rounded-full bg-zinc-400"></div>
                        <span>
                          23 сторінки
                        </span>
                      </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <Image src="/icons/night.svg" alt="Night" width="30" height="30" />
                  <div className="flex flex-col align-start gap-0 text-md text-zinc-400 font-medium">
                      <span>
                        Сьогодні, 20:30
                      </span>
                      <span className="flex items-center gap-3">
                        <span>
                          22 хв      
                        </span>
                        <div className="w-0.75 h-0.75 rounded-full bg-zinc-400"></div>
                        <span>
                          23 сторінки
                        </span>
                      </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <Image src="/icons/day.svg" alt="Night" width="30" height="30" />
                  <div className="flex flex-col align-start gap-0 text-md text-zinc-400 font-medium">
                      <span>
                        Сьогодні, 20:30
                      </span>
                      <span className="flex items-center gap-3">
                        <span>
                          22 хв      
                        </span>
                        <div className="w-0.75 h-0.75 rounded-full bg-zinc-400"></div>
                        <span>
                          23 сторінки
                        </span>
                      </span>
                  </div>
                </div>
              </div>  

              <div className="w-full h-[20vh] rounded-2xl p-5 relative flex flex-col gap-5 bg-[#141113] overflow-hidden shadow-md group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF4B6B]/15 rounded-full blur-2xl pointer-events-none z-0"></div>
                <div className="absolute -bottom-12 right-6 w-36 h-36 bg-amber-600/10 rounded-full blur-[35px] pointer-events-none z-0"></div>
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#141113]/40 pointer-events-none z-0"></div>
                
                <h3 className="text-xl font-bold text-white tracking-wider">
                  "Читач живе тисячу життів перед тим, як померти"
                </h3>

                <p className="font-medium text-md text-white">
                  - George R. R. Martin 
                </p>
              </div>
            </div>
            

          </main>
        </div>
  )
}


const ProtectedPage = withAuth(NowReadingContent);

export default function NowReadingPage() {
  return <ProtectedPage/>;
}