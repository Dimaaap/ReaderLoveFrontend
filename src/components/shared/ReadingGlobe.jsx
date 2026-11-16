"use client"

import {
    useEffect, useMemo, useRef, useState
} from "react"

import Globe from "react-globe.gl"
import * as THREE from "three"
import { fa } from "zod/locales"


const getCountryColor = (count) => {
    if (count >= 50) return "#F47732";
    if (count >= 25) return "#FF963E";
    if (count >= 6) return "#FFC66D";
    if (count > 0) return "#FFE0A3";

    return "#302D29"
}


export const ReadingGlobe = ({ countries = [], onCountryClick }) => {
    const globeRef = useRef(null)
    const containerRef = useRef(null)

    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 420
    })

    const [geoData, setGeoData] = useState(null)

    useEffect(() => {
        let active = true;

        fetch("/geo/countries.geojson")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Не вдалось завантажити GeoJSON")
                }

                return response.json();
            })
            .then((data) => {
                if (active) setGeoData(data);
            })
            .catch((error) => {
                console.error("GeoJSON error: ", error)
            })

        return () => {
            active = false;
        }
    }, [])

    useEffect(() => {
        const element = containerRef.current;

        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            })
        })

        observer.ovserve(element)

        return () => observer.disconnect();
    }, [])

    const globeMaterial = useMemo(
        () => new THREE.MeshPhongMaterial({
            color: "#292724",
            shininess: 2,
            specular: new THREE.Color("#151311")
        }),
        []
    )

    const polygons = useMemo(() => {
        if (!geoData?.features) return [];

        const countriesMap = new Map(
            countries.map((country) => [
                country.code?.toUpperCase(),
                country
            ])
        )

        return geoData.features.map((feature) => {
            const properties = feature.properties || {};

            const code = (
                properties.ISO_A2_EH ??
                properties.ISO_A2 ??
                properties.iso_a2 ??
                ""
            ).toUpperCase();

            return {
                ...feature,
                code,
                stats: countriesMap.get(code) || null
            }
        })
    }, [geoData, countries])

    const pointOfView = {
        lat: 20,
        lng: 15,
        altitude: 2.1,
    }

    const changeZoom = (direction) => {
        if (!globeRef.current) return;

        const current = globeRef.current.pointOfView();

        const altitude = direction === "in" ? Math.max(0.9, current.altitude - 0.3) : Math.min(4, current.altitude + 0.3)

        globeRef.current.pointOfView({
            ...current,
            altitude
        }, 300)
    }

    const resetGlobe = () => {
        globeRef.current?.pointOfView(pointOfView, 800);
    }
    
    
    return (
        <div
            ref={ containerRef }
            className="relative flex h-87.5 w-full items-center justify-center sm:h-107.5 lg:h-115"
        >
            { dimensions.width > 0 && polygons.length > 0 && (
                <Globe 
                    ref={ globeRef }
                    width={ dimensions.width }
                    height={ dimensions.height }
                    backgroundColor="rgba(0, 0, 0, 0)"
                    globeImageUrl={ null }
                    bumpImageUrl={ null }
                    showAtmosphere={ false }
                    showGraticules={ false }
                    globeMaterial={ globeMaterial }
                    polygonsData={ polygons }
                    polygonGeoJsonGeometry={ (d) => d.geometry }
                    polygonCapColor={ (d) => getCountryColor(d.stats?.books_count || 0) }
                    polygonSideColor={ () => "#252320" }
                    polygonStrokeColor={ () => "#252320" }
                    polygonAltitude={ (d) => d.stats ? 0.0015 : 0.0005 }
                    polygonCapCurvatureResolution={ 4 }
                    polygonsTransitionDuration={ 500 }
                    polygonLabel={ (d) => {
                        const name = d.stats?.name_uk || d.properties?.name || "Невідома країна"

                        const books = d.stats?.books_count || 0;
                        const authors = d.stats?.authors_count || 0

                        return `
                            <div style="
                                background: #33302D;
                                color: #fff;
                                padding: 10px 12px;
                                border-radius: 9px;
                                border: 1px solid #514A43;
                                font-family: Arial, sans-serif;
                            ">
                                <div style="font-weight: 600; margin-bottom: 5px;">
                                    ${ name }
                                </div>
                                <div style="color: #FFC66D">
                                    ${ books } книг
                                </div>
                                <div style="color: #BDB8B2">
                                    ${ authors } авторів
                                </div>
                            </div>
                        `
                    } }
                    onPolygonClick={ (polygon) => {
                        if (polygon.stats) {
                            onCountryClick?.(polygon.stats)
                        }
                    } }

                    onGlobeReady={ resetGlobe }
                />
            ) }

            { !geoData && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-[#858080]">
                    Завантаження глобуса...
                </div>
            ) }

            <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => changeZoom("in")}
                    aria-label="Збільшити глобус"
                    className="flex h-10 w-10 items-center justify-center rounded-full border 
                    border-[#494542] bg-[#383634] text-xl text-white transition hover:bg-[#4A4642]"
                >
                    +
                </button>

                <button
                    type="button"
                    onClick={() => changeZoom("out")}
                    aria-label="Зменшити глобус"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#494542] 
                    bg-[#383634] text-xl text-white transition hover:bg-[#4A4642]"
                >
                    −
                </button>

                 <button
                    type="button"
                    onClick={resetGlobe}
                    aria-label="Скинути положення глобуса"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#494542] 
                    bg-[#383634] text-white transition hover:bg-[#4A4642]"
                >
                    <span className="text-lg">➤</span>
                </button>
            </div>
        </div>
    )
}
