"use client"

import { PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';

export function ChartCard({ title, data }) {
    return (
        <div className="w-full p-6 bg-[#121318] text-white rounded-2xl shadow-md flex flex-col 
        sm:flex-row items-center justify-between gap-6">
            <div className="h-40 w-40 relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={ data }
                            cx="50%"
                            cy="50%"
                            innerRadius={ 50 }
                            outerRadius={ 70 }
                            paddingAngle={ 0 }
                            dataKey="value"
                        >
                            { data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ entry.color } stroke="none" />
                            )) }
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-3">
                <h3 className="text-base font-semibold text-zinc-400 mb-4 sm:text-left text-center">{ title }</h3>

                <div className="space-y-2">
                    { data.map((item, index) => (
                        <div key={ index } className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full inline-block"
                                style={{ backgroundColor: item.color }}></span>
                                <span className="text-zinc-300 font-medium">{ item.name }</span>
                            </div>
                            <span className="text-zinc-400 font-semibold">{ item.value }%</span>
                        </div>
                    )) }
                </div>
            </div>
        </div>
    )
}