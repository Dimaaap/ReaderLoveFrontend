
export const TemplateQuote = ({ quote }) => {
  return (
    <div className="w-full h-[20vh] rounded-2xl p-5 relative flex flex-col gap-5 bg-[#141113] overflow-hidden shadow-md group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF4B6B]/15 rounded-full blur-2xl pointer-events-none z-0"></div>
        <div className="absolute -bottom-12 right-6 w-36 h-36 bg-amber-600/10 rounded-full blur-[35px] pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#141113]/40 pointer-events-none z-0"></div>
        
        <h3 className="text-xl font-bold text-white tracking-wider">
            { quote.quote }
        </h3>
        <p className="font-medium text-md text-white">
            - { quote.author }
        </p>
    </div>
  )
}