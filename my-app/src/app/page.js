"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import NavBar from "./componentes/NavBar";
import MovieCarrusel from "./componentes/MovieCarrusel";
import LoadingScreen from "./componentes/LoadingScreen";
import TestFirebase from "./componentes/TestFirebase";

export default function Home() {
    const [showIds, setShowIds] = useState([]); // IDs para el carrusel
    const [loading, setLoading] = useState(true); // Estado inicial de carga (true para mostrar pantalla)
    const [showNavBar, setShowNavBar] = useState(false); // Estado para controlar la visibilidad de la NavBar
    const totalShows = 15; // Total de series únicas a mostrar
    const totalToShow = 5; // Series visibles al mismo tiempo en el carrusel

    useEffect(() => {
        const fetchTotalShows = async () => {
            try {
                const response = await fetch("https://api.tvmaze.com/shows");
                const data = await response.json();
                const totalShowsAvailable = data.length;

                // Generar IDs únicos para 15 series
                const newIds = generateUniqueRandomIds(totalShows, 1, totalShowsAvailable, []);
                setShowIds(newIds);
            } catch (error) {
                console.error("Error fetching total shows:", error);
            } finally {
                setTimeout(() => setLoading(false), 1000); // Simular carga por 1 segundo
            }
        };

        fetchTotalShows();
    }, []);

    const generateUniqueRandomIds = (count, min, max, exclude) => {
        const ids = new Set();
        while (ids.size < count) {
            const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!exclude.includes(randomId)) {
                ids.add(randomId);
            }
        }
        return Array.from(ids);
    };

    const handleSearch = async (query) => {
        setLoading(true); // Mostrar pantalla de carga al buscar
        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            const data = await response.json();
            const ids = data
                .filter((result) => result.show.image) // Filtrar solo shows con imágenes
                .map((result) => result.show.id); // Extraer IDs de los resultados
            setShowIds(ids.slice(0, totalShows)); // Mostrar hasta 15 series únicas
        } catch (error) {
            console.error("Error searching shows:", error);
        } finally {
            setTimeout(() => setLoading(false), 1000); // Simular carga por 1 segundo
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const carouselElement = document.querySelector(".movie-carousel");
            if (carouselElement) {
                const { top } = carouselElement.getBoundingClientRect();
                setShowNavBar(top <= window.innerHeight);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div style={{ overflow: "hidden" }}>
            <div className="ibinge">
                <Typography sx={{ color: "white", fontSize: "100px" }}>iBinge</Typography>
            </div>
            <hr />
            {showNavBar && <NavBar onSearch={handleSearch} />}
            {loading ? ( // Mostrar la pantalla de carga mientras `loading` es true
                <LoadingScreen />
            ) : (
                <>
                    <div className="movie-carousel">
                        <MovieCarrusel showIds={showIds} totalToShow={totalToShow} /> {/* Pasar IDs al carrusel */}
                    </div>
                </>
            )}
            <hr />
            <div className="platform-section">
                <div className="platform-content">
                    {/* Parte izquierda */}
                    <div className="platform-left">
                        <h1>Selecciona</h1>
                    </div>

                    {/* Parte derecha */}
                    <div className="platform-right">
                        <div className="platform-grid">
                            <button
                                className="platform-button platform-netflix"
                                onClick={() => window.open("https://www.netflix.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-max"
                                onClick={() => window.open("https://www.max.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-hulu"
                                onClick={() => window.open("https://www.hulu.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-paramount"
                                onClick={() => window.open("https://www.paramountplus.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-primevideo"
                                onClick={() => window.open("https://www.primevideo.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-peacock"
                                onClick={() => window.open("https://www.peacocktv.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-disney"
                                onClick={() => window.open("https://www.disneyplus.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-apple"
                                onClick={() => window.open("https://tv.apple.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-crunchyroll"
                                onClick={() => window.open("https://www.crunchyroll.com", "_blank")}
                            ></button>
                        </div>
                    </div>
                </div>
            </div>
            <TestFirebase />
        </div>
    );
}
