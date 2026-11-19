
"use client";

import { memo, useMemo, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from "react-simple-maps";
import { scaleSqrt } from "d3-scale";
import { Minus, Plus, RotateCcw } from "lucide-react";

export const MAP_COLORS = {
    empty: "#2A2527",
    stroke: "#0D0B0C",
    min: "#E9C99B",
    max: "#6B1F0A",
    hover: "#F59E0B",
};

const GEO_URL = "/maps/world-ukr.json";

const DEFAULT_CENTER = [0, 5];
const DEFAULT_ZOOM = 1;

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 0.5;

function ReadingMap({ countries = [], onCountryClick }) {
    const [tooltip, setTooltip] = useState(null);

    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    const [center, setCenter] = useState(DEFAULT_CENTER);


    const countryByCode = useMemo(() => {
        const map = new Map();

        for (const country of countries) {
            const code = country.code?.toUpperCase();

            if (code) map.set(code, country);
        }

        return map;
    }, [countries]);

    const colorScale = useMemo(() => {
        const max = Math.max(
            2,
            ...countries.map((c) => Number(c.books_count) || 0)
        );

        return scaleSqrt()
            .domain([1, max])
            .range([MAP_COLORS.min, MAP_COLORS.max]);
    }, [countries]);

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP))
    }

    const handleReset = () => {
        setZoom(DEFAULT_ZOOM);
        setCenter(DEFAULT_CENTER);
        setTooltip(null)
    }

    const handleMoveEnd = (position) => {
        if (position?.coordinates) {
            setCenter(position.coordinates);
        }

        if (typeof position?.zoom === "number") {
            setZoom(position.zoom);
        }
    };

    return (
        <div className="relative mx-auto w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#141113]">
            
            <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#1C191B]
            shadow-lg">
                <button
                    type="button"
                    onClick={ handleZoomIn }
                    disabled={ zoom >= MAX_ZOOM }
                    aria-label="Наблизити карту"
                    title="Наблизити"
                    className="flex h-10 w-10 items-center justify-center text-[#E9C99B] transition-colors 
                    hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <Plus size={ 19 } />
                </button>

                <div className="h-px bg-white/10" />

                <button
                    type="button"
                    onClick={ handleZoomOut }
                    disabled={ zoom <= MIN_ZOOM }
                    aria-label="Віддалити карту"
                    title="Віддалити"
                    className="flex h-10 w-10 items-center justify-center text-[#E9C99B] transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <Minus size={ 19 } />
                </button>

                <div className="h-px bg-white/10" />

                <button
                    type="button"
                    onClick={ handleReset }
                    aria-label="Скинути масштаб карти"
                    title="Скинути масштаб"
                    className="flex h-10 w-10 items-center justify-center text-[#E9C99B] transition-colors hover:bg-white/10"
                >
                    <RotateCcw size={ 17 } />
                </button>
            </div>

            <div className="absolute bottom-4 right-4 z-20 rounded-md border border-white/10 bg-[#1C191B]/90 
            px-2.5 py-1.5 text-xs text-[#A69A9F]">
                { Math.round(zoom * 100) }%
            </div>
            
            <ComposableMap
                width={1200}
                height={550}
                projection="geoEqualEarth"
                projectionConfig={{
                    scale: 190,
                    center: [0, 5],
                }}
                style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                }}
            >
                <ZoomableGroup minZoom={1} maxZoom={8} center={ center } zoom={ zoom } onMoveEnd={ handleMoveEnd }>
                    <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const code =
                                    geo.properties.ISO_A2_EH ||
                                    geo.properties.ISO_A2;

                                const country = countryByCode.get(
                                    code?.toUpperCase()
                                );

                                const hasBooks = Boolean(country);

                                const fill = hasBooks
                                    ? colorScale(
                                        Number(country.books_count) || 1
                                    )
                                    : MAP_COLORS.empty;

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={fill}
                                        stroke={MAP_COLORS.stroke}
                                        strokeWidth={0.4}
                                        onMouseMove={(e) =>
                                            setTooltip({
                                                x: e.clientX,
                                                y: e.clientY,
                                                name:
                                                    country?.name_uk ||
                                                    country?.name ||
                                                    geo.properties.NAME,
                                                books:
                                                    country?.books_count || 0,
                                            })
                                        }
                                        onMouseLeave={() =>
                                            setTooltip(null)
                                        }
                                        onClick={() =>
                                            hasBooks &&
                                            onCountryClick?.(country)
                                        }
                                        style={{
                                            default: {
                                                outline: "none",
                                            },
                                            hover: {
                                                outline: "none",
                                                fill: hasBooks
                                                    ? MAP_COLORS.hover
                                                    : "#3A3437",
                                                cursor: hasBooks
                                                    ? "pointer"
                                                    : "default",
                                            },
                                            pressed: {
                                                outline: "none",
                                            },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {tooltip && (
                <div
                    className="pointer-events-none fixed z-50 rounded-md bg-black/90 px-3 py-2 text-xs text-white shadow-lg"
                    style={{
                        left: tooltip.x + 12,
                        top: tooltip.y + 12,
                    }}
                >
                    <div className="font-medium">
                        {tooltip.name}
                    </div>

                    <div className="text-[#99918B]">
                        {tooltip.books > 0
                            ? `Книг: ${tooltip.books}`
                            : "Немає книг"}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(ReadingMap);
