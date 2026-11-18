"use client";

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from "react-simple-maps";
import { useMemo, useState } from "react";

const GEO_URL = "/geo/countries.geojson";

const INITIAL_CENTER = [15, 20];
const INITIAL_ZOOM = 1;

const COUNTRY_NAME_ALIASES = {
    "united states": "united states of america",
    "uk": "united kingdom",
    "great britain": "united kingdom",
    "czech republic": "czechia",
    "south korea": "korea",
    "russia": "russian federation",
};

const getCountryColor = (booksCount = 0) => {
    if (booksCount === 0) return "#1E1A1B";
    if (booksCount >= 50) return "#F47732";
    if (booksCount >= 26) return "#FF963E";
    if (booksCount >= 6) return "#FFC66D";
    return "#FFE0A3";
};

export default function ReadingMap({
    countries = [],
    onCountryClick
}) {
    const [zoom, setZoom] = useState(INITIAL_ZOOM);
    const [center, setCenter] = useState(INITIAL_CENTER);
    const [hoveredCountry, setHoveredCountry] = useState(null);

    const countriesMap = useMemo(() => {
        const map = new Map();

        countries.forEach((country) => {
            if (!country.name) return;
            const normalizedName = country.name.trim().toLowerCase();
            map.set(normalizedName, country);

            if (COUNTRY_NAME_ALIASES[normalizedName]) {
                map.set(COUNTRY_NAME_ALIASES[normalizedName], country);
            }
        });

        return map;
    }, [countries]);

    const resetMap = () => {
        setZoom(INITIAL_ZOOM);
        setCenter(INITIAL_CENTER);
    };

    const changeZoom = (direction) => {
        setZoom((previous) => {
            if (direction === "in") {
                return Math.min(previous + 0.4, 8);
            }
            return Math.max(previous - 0.4, 1);
        });
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-[#45413E] bg-[#141113]">
            <div className="flex items-center justify-between border-b border-[#302D2A] px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold text-white">
                        Карта читання
                    </h2>
                    <p className="mt-1 text-xs text-[#99918B]">
                        Географія авторів вашої бібліотеки
                    </p>
                </div>

                <span className="rounded-full border border-[#45413E] bg-[#292725] px-3 py-1 text-xs text-[#D5D0CC]">
                    {countries.length} країн
                </span>
            </div>

            <div className="relative flex min-h-112.5 items-center justify-center px-2 py-4 sm:px-5">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 120,
                        center: [0, 35]
                    }}
                    width={800}
                    height={400}
                    className="h-auto w-full"
                >
                    <ZoomableGroup
                        center={center}
                        zoom={zoom}
                        minZoom={1}
                        maxZoom={8}
                        onMoveEnd={({ coordinates, zoom }) => {
                            setCenter(coordinates);
                            setZoom(zoom);
                        }}
                    >
                        <Geographies geography={GEO_URL}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const rawGeoName = geo.properties?.name || "";
                                    const geoName = rawGeoName.trim().toLowerCase();

                                    const country = countriesMap.get(geoName);
                                    const booksCount = country?.books_count || 0;
                                    const resolvedName =
                                        country?.name_uk || rawGeoName || "Невідома країна";

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onMouseEnter={() => {
                                                setHoveredCountry({
                                                    name: resolvedName,
                                                    booksCount,
                                                    authorsCount: country?.authors_count || 0
                                                });
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredCountry(null);
                                            }}
                                            onClick={() => {
                                                if (country) {
                                                    onCountryClick?.(country);
                                                }
                                            }}
                                            style={{
                                            default: {
                                                fill: getCountryColor(booksCount),
                                                stroke: "#383431",
                                                strokeWidth: 0.7, 
                                                outline: "none",
                                                transition: "fill 150ms"
                                            },
                                            hover: {
                                                fill: "#FFAA55",
                                                stroke: "#FFFFFF",
                                                strokeWidth: 1,
                                                outline: "none",
                                                cursor: country ? "pointer" : "default"
                                            },
                                            pressed: {
                                                fill: "#F47732",
                                                outline: "none"
                                            }
                                        }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>

                {hoveredCountry && (
                    <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl border border-[#514A43] bg-[#292725]/95 px-4 py-3 shadow-xl backdrop-blur-sm">
                        <p className="text-sm font-semibold text-white">
                            {hoveredCountry.name}
                        </p>
                        <p className="mt-1 text-xs text-[#FFAA55]">
                            {hoveredCountry.booksCount} книг
                        </p>
                        <p className="mt-1 text-xs text-[#BDB8B2]">
                            {hoveredCountry.authorsCount} авторів
                        </p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => changeZoom("in")}
                    aria-label="Збільшити карту"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#494542] bg-[#383634] text-xl text-white transition hover:bg-[#4A4642]"
                >
                    +
                </button>
                <button
                    type="button"
                    onClick={() => changeZoom("out")}
                    aria-label="Зменшити карту"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#494542] bg-[#383634] text-xl text-white transition hover:bg-[#4A4642]"
                >
                    −
                </button>
                <button
                    type="button"
                    onClick={resetMap}
                    aria-label="Скинути карту"
                    className="flex h-9 items-center justify-center rounded-lg border border-[#494542] bg-[#383634] px-3 text-xs text-white transition hover:bg-[#4A4642]"
                >
                    Скинути
                </button>
            </div>
        </div>
    );
}