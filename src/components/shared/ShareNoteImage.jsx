import { forwardRef } from 'react'

export const ShareNoteImage = forwardRef(({note, onClose, onDownload}, ref) => {

    const getYearFromDate = (dateTimeString) => {
        if(!dateTimeString) return "2026";
        const date = new Date(dateTimeString);
        return isNaN(date.getTime()) ? "2026" : date.getFullYear()
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={ onClose }>
        <div
            ref={ ref }
            style={{
                position: "relative",
                width: "600px",
                height: "338px",
                minWidth: "600px",
                minHeight: "338px",
                boxSizing: "border-box",
                padding: "32px",
                overflow: "hidden",
                backgroundColor: "#0D0B0C", 
                color: "#ffffff",
                borderRadius: "20px",
                border: "1px solid #232326"
            }}
            onClick={ (e) => e.stopPropagation() }
        >
            <div style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                zIndex: 10
            }}>
                <div 
                    style={{ 
                        backgroundColor: "#5B1E1E", 
                        border: "1px solid rgba(113, 113, 122, 0.2)",
                        padding: "10px",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        boxSizing: "border-box"
                    }}
                >
                    <img src="/icons/dots-horizontal.svg" alt="more" style={{ width: "18px", height: "18px" }} /> 
                </div>
            </div>

            <div style={{
                position: "absolute",
                top: "32px",
                left: "32px",
                right: "96px"
            }}>
                <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: "bold", margin: 0, padding: 0, fontFamily: "sans-serif", lineHeight: "1.2" }}>
                    { note.book?.title } | { getYearFromDate(note.created_at) } р.
                </h2>
            </div>

            <div 
                style={{
                    position: "absolute",
                    top: "90px",
                    left: "32px",
                    right: "32px",
                    height: "100px",
                    color: "#E99797",
                    fontSize: "24px",
                    lineHeight: "1.4",
                    fontFamily: "serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center"
                }}
            >
                “{ note.note_text }”
            </div>
            
            <div style={{
                position: "absolute", bottom: "92px", left: "32px", right: "32px", textAlign: "center"
            }}>
                <p style={{ color: "#a1a1aa", fontFamily: "sans-serif", fontSize: "18px", fontWeight: "600", margin: 0 }}>
                    Моя цитата
                </p>
            </div>

            <div style={{ position: "absolute", bottom: "32px", left: "32px", right: "32px", height: "42px" }}>
                <div style={{ position: "absolute", left: 0, bottom: 0 }}>
                    <span 
                        style={{
                            color: "#ffffff",
                            backgroundColor: "#2D3A35",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: "1px solid #232326",
                            fontFamily: "sans-serif",
                            fontSize: "14px",
                            fontWeight: "600",
                            display: "inline-block"
                        }}
                    >
                        { note.note_category }
                    </span>    
                </div>
                
                <div style={{ position: "absolute", right: 0, bottom: "4px", display: "flex", alignItems: "center" }}>
                    <img 
                        src={note.is_important ? "/icons/bookmark.svg" : "/icons/bookmark-transparent-white.svg"} 
                        alt="bookmark"
                        style={{ width: "24px", height: "24px" }} 
                    />    
                </div>
            </div>
        </div>   

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <button
                onClick={ onDownload }
                className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-8 py-3 rounded-xl font-bold text-lg shadow-md 
                transition-colors flex items-center gap-3 cursor-pointer"
            >
                <img src="/icons/download.svg" alt="download" style={{ width: "20px", height: "20px" }} />
                Поділитись
            </button>
        </div> 
    </div>
  )
})

ShareNoteImage.displayName = "ShareNoteImage"