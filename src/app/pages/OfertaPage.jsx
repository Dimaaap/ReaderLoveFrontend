export default function OfertaPage() {
    return (
        <div className="h-full w-full flex flex-col gap-10">
            <div className="h-[50vh] w-full bg-[url('/oferta-background.jpg')] text-white flex flex-col gap-7 
            bg-no-repeat bg-cover bg-linear-to-t from-sky-500 to-indigo-500 text-center
            pt-[7%] background-[50%] bg-center">
                <h1 className="text-6xl font-bold">
                    Договір публічної оферти
                </h1>
                <h5 className="text-xl font-normal">
                    Про надання у термінове користування програмного комплексу ReaderLove» на умовах публічної оферти
                </h5>
            </div>    

            <div className="w-[50%] h-auto text-black text-xl mx-auto font-normal rounded-md p-7 bg-[#f5f5f5]">
                <p className="text-xl">
                    ФОП Грядунов Р.Р. (далі — Виконавець), чинного виходячи з Статуту, з одного боку, іменований надалі 
                    «Виконавець», керуючись ст. 633, 634, 641, 642 Цивільного кодексу України, цією публічною офертою
                    пропонує будь-якій фізичній особі, у тому числі фізичній особі — підприємцю або юридичній особі,
                    які наділені цивільною правоздатністю та дієздатністю, надалі — "Замовник, Користувач", 
                    укласти цей договір на таких умовах:
                </p>
            </div>
        </div>
        
    )
}