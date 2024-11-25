"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "../componentes/NavBar";
import "./Results.css"; // Usar el CSS proporcionado

export default function Page() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [shows, setShows] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (searchQuery) => {
        try {
            const response = await fetch(
                `https://api.tvmaze.com/search/shows?q=${searchQuery}`
            );
            if (!response.ok) throw new Error("Error fetching data");
            const data = await response.json();
            setShows(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Ocurrió un error al buscar series. Intenta de nuevo.");
        }
    };

    return (
        <div className="result-container">
            <NavBar onSearch={handleSearch} />
            <h1 className="result-title">Resultados de Búsqueda</h1>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="show-list">
                    {shows.map((showData, index) => {
                        const show = showData.show || {};
                        return (
                            <a
                                key={index}
                                href={`/series/${show.id}`}
                                className="show-card-link"
                            >
                                <div className="show-card">
                                    <img
                                        src={
                                            show.image?.medium ||
                                            "https://via.placeholder.com/200x500?text=No+Image"
                                        }
                                        alt={show.name || "Sin título"}
                                    />
                                    <div className="show-card-title">
                                        {show.name || "Sin título"}
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
