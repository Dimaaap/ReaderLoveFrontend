import { ImageResponse } from "next/og"

export const runtime = "nodejs";

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "Назва книги";
    const text = searchParams.get("text") || "Текст цитати";
    const category = searchParams.get("category") || "Підсумки";

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '600px',
                    height: '338px',
                    backgroundColor: '#0D0B0C',
                    padding: '32px',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                    boxSizing: 'border-box',
                }}
            >
                <div style={{ display: 'flex', color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>
                    {title} | 2026 р.
                </div>

                <div style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#E99797', 
                    fontSize: '24px', 
                    textAlign: 'center', 
                    marginTop: 'auto', 
                    marginBottom: 'auto',
                    fontStyle: 'italic' 
                }}>
                    “{text}”
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ display: 'flex', color: '#ffffff', backgroundColor: '#2D3A35', padding: '10px 16px', borderRadius: '8px', fontSize: '14px' }}>
                        {category}
                    </span>
                    <span style={{ display: 'flex', color: '#F43F5E', fontSize: '24px' }}>🔖</span>
                </div>
            </div>
        ),
        {
            width: 600,
            height: 338,
        }
    );
}