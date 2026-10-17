"use client" 

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';


export function PagesReadChart({ data=[] }) {
  return (
    <div className="w-full p-6 bg-[#121318] text-white rounded-xl shadow-md">
        <div className="">
            <h3 className="text-lg font-semibold text-zinc-400">Прочитано сторінок</h3>
        </div>

        <div className="h-80 mt-5 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ data } margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={ false } stroke="#1f212a" />

                    <XAxis 
                        dataKey="date"
                        axisLine={ false }
                        tickLine={ false }
                        tick={{ fill: "#64748b", fontSize: 14 }}
                        dy={ 10 }
                    />

                    <YAxis 
                        axisLine={ false }
                        tickLine={ false }
                        tick={{ fill: "#64748b", fontSize: 14 }}
                        domain={[0, 158]}
                        tickCount={ 4 }
                    />

                    <Tooltip 
                        cursor={{ fill: "transparent" }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return(
                                    <div className="bg-[#1e2230] border border-zinc-400 p-2 rounded text-md font-semibold text-white">
                                        <p>{`${payload[0].payload.date}: ${payload[0].payload.pages} сторінок`}</p>
                                    </div>
                                )
                            }

                            return null
                        }}
                    />

                    <Bar 
                        dataKey="pages"
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={ 12 }
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}
