"use client"

import { GeographyHeader, Sidebar } from '@/components';
import { withAuth } from '@/components/WithAuth';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useReadingGeography } from "@/hooks/useReadingGeography"
import GlobeLegend from '@/components/shared/GlobeLegend';
import GeographyStats from '@/components/shared/GeographyStats';
import GeographyCountries from '@/components/shared/GeographyCountries';
import CountryDetails from '@/components/shared/CountryDetails';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
    () => import('@/components/shared/MapContainer'), 
    { 
        ssr: false,
        loading: () => (
            <div className="flex h-100 w-full items-center justify-center bg-[#141113] text-sm text-[#99918B]">
                Завантаження карти...
            </div>
        )
    }
);


function GeographyContent() {
    const { user } = useAuth();

    const [selectedCountry, setSelectedCountry] = useState(null);


    const {
        data: countries = [],
        isLoading,
        isError,
        error,
    } = useReadingGeography(user?.username, "all");

    console.log("2. Geography query:", {
        username: user?.username,
        isLoading,
        isError,
        countriesCount: countries.length,
        error: error?.message,
    });

    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden z-20">
            <Sidebar username={user?.username} />

            <main className="flex-1 h-full overflow-y-auto p-8 text-white">
                <div className="mx-auto flex w-full max-w-375 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <GeographyHeader />

                    {isLoading && (
                        <div className="flex min-h-105 items-center justify-center text-sm text-[#99918B]">
                            Завантаження географії читання...
                        </div>
                    )}

                    {isError && (
                        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-300">
                            {error?.message || "Не вдалося завантажити статистику"}
                        </div>
                    )}

                    {!isLoading && !isError && (
                        <>
                            <MapContainer countries={ countries } onCountryClick={ setSelectedCountry } />

                            <GlobeLegend />

                            <GeographyStats
                                countries={countries}
                                totalBooks={countries.reduce(
                                    (total, country) => total + country.books_count,
                                    0
                                )}
                            />

                            <GeographyCountries
                                countries={countries}
                                onCountryClick={setSelectedCountry}
                            />
                        </>
                    )}
                </div>
            </main>

            <CountryDetails
                country={selectedCountry}
                onClose={() => setSelectedCountry(null)}
            />
        </div>
    );
}

const ProtectedPage = withAuth(GeographyContent)

export default function UserGeographyPage() {
    return <ProtectedPage />
}