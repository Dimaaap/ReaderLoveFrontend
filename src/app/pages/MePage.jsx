"use client";

import { Sidebar } from '@/components';
import { withAuth } from '@/components/WithAuth'

function MeContent() {
  return (
    <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden">
      
      <Sidebar username="Dima" />
      
      <main className="flex-1 h-full overflow-y-auto p-8 text-white">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Моя бібліотека</h1>
            <button className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                + Додати книгу
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#141113] border border-white/5 h-64 rounded-2xl p-4 flex flex-col justify-end">
                <div className="w-full h-4/5 bg-white/5 rounded-xl mb-3 animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
            <div className="bg-[#141113] border border-white/5 h-64 rounded-2xl p-4 flex flex-col justify-end">
                <div className="w-full h-4/5 bg-white/5 rounded-xl mb-3 animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
        </div>
      </main>

    </div>
  )
}

const ProtectedMePage = withAuth(MeContent);

export default function MePage() {
  return <ProtectedMePage />;
}