import Image from 'next/image'

export const FeaturesSection = () => {
  return (
    <div className="flex flex-col gap-10 w-full px-5 py-16 text-center">
      
      {/* Заголовок */}
      <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl w-full sm:w-[80%] lg:w-[45%] mx-auto text-start leading-tight">
        Читачі, які користуються Rork, читають і досягають більшого
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full lg:w-[70%] mx-auto">
        
        <div className="flex flex-col gap-2 items-start">
          <span className="flex items-center gap-3">
            <Image src="/icons/clock.svg" alt="clock" width={30} height={30} />
            <h5 className="font-bold text-lg">
              х2.5 на час читання
            </h5>
          </span>
          <p className="text-base sm:text-lg text-start">
            Читаючи з Rork, власні успіхи та календар дають мотивації читати в x2.5 рази більше часу, ніж читачам, які читають без Rork
          </p>
        </div>

        <div className="flex flex-col gap-2 items-start">
          <span className="flex items-center gap-3">
            <Image src="/icons/present.svg" alt="present" width={30} height={30} />
            <h5 className="font-bold text-lg">
              +300% нових книжок
            </h5>
          </span>
          <p className="text-base sm:text-lg text-start">
            Звичайні читачі відкривають 1-3 книжки на місяць, а читачі Rork знаходять цікавинки для себе по 2-3 на тиждень
          </p>
        </div>

        <div className="flex flex-col gap-2 items-start md:col-span-2 lg:col-span-1">
          <span className="flex items-center gap-3">
            <Image src="/icons/society.svg" alt="society" width={30} height={30} />
            <h5 className="font-bold text-lg">
              +125% соціального капіталу
            </h5>
          </span>
          <p className="text-base sm:text-lg text-start">
            Спільнота читачів Rork підтримує вас незалежно від досвіду. Ви отримуєте на 125% більше взаємодій через вподобайки та підписки.
          </p>
        </div>

      </div>
    </div>
  )
}