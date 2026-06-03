export async function fetcher(link) {
    const res = await fetch(link);

    if(!res.ok){
        throw new Error("Failed to fetch")
    }

    return res.json()
}