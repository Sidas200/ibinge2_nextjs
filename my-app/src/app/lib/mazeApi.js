// lib/mazeApi.js

// Función para buscar el ID de un show por nombre
export async function fetchShowId(query) {
    try {
        // Realiza la búsqueda del show usando el nombre
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`, {
            next: { revalidate: 60 }, // Opcional: Revalidación en segundos
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch show ID for query: ${query}. Status: ${res.status}`);
        }

        const data = await res.json();

        // Verificar si hay resultados y devolver el ID del primer show encontrado
        if (!data || data.length === 0) {
            throw new Error(`No shows found for query: ${query}`);
        }

        return data[0].show.id; // Retorna el ID del primer show
    } catch (error) {
        console.error("Error in fetchShowId:", error.message);
        throw error;
    }
}

// Función para obtener los detalles de un show por ID
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

// Función para obtener el elenco de un show por ID
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

