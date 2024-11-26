"use client";
export async function fetchShowId(query) {
    try {

        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch show ID for query: ${query}. Status: ${res.status}`);
        }

        const data = await res.json();


        if (!data || data.length === 0) {
            throw new Error(`No shows found for query: ${query}`);
        }

        return data[0].show.id;
    } catch (error) {
        console.error("Error in fetchShowId:", error.message);
        throw error;
    }
}

export async function fetchShowDetails(id) {
    try {
        const res = await fetch(`https://api.tvmaze.com/shows/${id}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch show details for ID: ${id}. Status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error in fetchShowDetails:", error.message);
        throw error;
    }
}

export async function fetchCast(id) {
    try {
        const res = await fetch(`https://api.tvmaze.com/shows/${id}/cast`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch cast details for ID: ${id}. Status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error in fetchCast:", error.message);
        throw error;
    }
}

