import { ChartCard } from "./ChartCard";

const timeData = [
    { name: "Ранок", value: 15, color: "#ffb076" },
    { name: "День", value: 25, color: "#7b7bf7" },
    { name: "Вечір", value: 45, color: "#b388ff" },
    { name: "Ніч", value: 15, color: "#565666" }
]

const genreData = [
    { name: "Фентезі", value: 45, color: "#ff758f" },
    { name: "Фікшн", value: 25, color: "#9d4edd" },
    { name: "Скай-Фай", value: 15, color: "#7b2cbf" },
    { name: "Романс", value: 10, color: "#3c096c" },
    { name: "Інше", value: 5, color: "#6c5a81" }
]

export default function ReadingStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4">
            <ChartCard title="Періоди читання" data={ timeData } />
            <ChartCard title="Топ жанри" data={ genreData } />
        </div>
    )
}