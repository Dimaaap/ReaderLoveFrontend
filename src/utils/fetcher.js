export async function fetcher(link, options={}) {
    const res = await fetch(link, options);

    if(!res.ok){
        const responseText = await res.text();

        console.error("STATUS:", res.status);
        console.error("API RESPONSE:", responseText);

        throw new Error(responseText);
    }

    return res.json()
}