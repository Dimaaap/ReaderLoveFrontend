"use client";

import { useAuth } from "@/hooks/useAuth";
import ReadingMap from "./ReadingMap";

export default function MapContainer({ countries, onCountryClick }) {

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">
                    Географія читання
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Досліджуй країни, звідки походять автори
                    твоєї бібліотеки
                </p>
            </div>

            <ReadingMap countries={countries} onCountryClick={onCountryClick} />
        </div>
    );
}