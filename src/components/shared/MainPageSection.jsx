import Image from 'next/image'

export const MainPageSection = ({
  imageSrc,
  header,
  textFirst,
  textSecond,
  backgroundColor = "#ffffff"
}) => {
  return (
    <section
      className="w-full relative overflow-hidden px-6 sm:px-10 lg:px-20 pt-16 lg:pt-10"
      style={{ backgroundColor }}
    >
      <div className="max-w-400 mx-auto min-h-[60vh] flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-0 lg:gap-6">
        <div className="relative w-full lg:w-[40%] flex justify-center lg:justify-start self-stretch">

          <div className="relative w-full flex justify-center lg:hidden">
            <div className="relative w-[40vw] max-w-80 sm:max-w-96 aspect-square">
              <Image
                src={imageSrc}
                alt=""
                fill
                sizes="(max-width: 768px) 320px, 420px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="hidden lg:flex relative w-full min-h-[60vh] items-end">
            <div className="relative w-90 h-90 xl:w-105 xl:h-105">
              <Image
                src={imageSrc}
                alt=""
                fill
                sizes="420px"
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>

        </div>

        <div className="w-full lg:w-[50%] flex flex-col justify-center text-start py-2 lg:py-0 lg:-ml-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            {header}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
            {textFirst}
            <br /><br />
            {textSecond}
          </p>
        </div>

      </div>
    </section>
  )
}