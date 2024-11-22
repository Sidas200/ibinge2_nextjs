"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import NavBar from "./componentes/NavBar";
//import ShowList from "./componentes/ShowList";
import MovieCarrusel from "./componentes/MovieCarrusel";
import LoadingScreen from "./componentes/LoadingScreen";
import TestFirebase from "./componentes/TestFirebase";
import netflix from './images/bb2346582caedef6034cb425150edcbc.jpg'

export default function Home() {
    const [showIds, setShowIds] = useState([]); // IDs para los shows
    const [loading, setLoading] = useState(true); // Estado inicial de carga (true para mostrar pantalla)
    const [showNavBar, setShowNavBar] = useState(false); // Estado para controlar la visibilidad de la NavBar

    useEffect(() => {
        const fetchTotalShows = async () => {
            try {
                const response = await fetch("https://api.tvmaze.com/shows");
                const data = await response.json();
                const totalShows = data.length;

                const randomIds = generateRandomIds(5, 1, totalShows);
                setShowIds(randomIds); // Guardar los IDs aleatorios
            } catch (error) {
                console.error("Error fetching total shows:", error);
            } finally {
                setTimeout(() => setLoading(false), 1000); // Simular carga por 1 segundo
            }
        };

        fetchTotalShows();
    }, []);

    const generateRandomIds = (count, min, max) => {
        const ids = new Set();
        while (ids.size < count) {
            const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
            ids.add(randomId);
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
            setShowIds(ids); // Actualizar los IDs
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
        <div style={{overflow: "hidden"}}>
            <div className="ibinge">
                <Typography sx={{color: "white", fontSize: "100px"}}>iBinge</Typography>
            </div>
            <hr/>
            {showNavBar && <NavBar onSearch={handleSearch}/>}
            {loading ? ( // Mostrar la pantalla de carga mientras `loading` es true
                <LoadingScreen/>
            ) : (
                <>
                    <div className="movie-carousel">
                        <MovieCarrusel showIds={showIds}/> {/* Pasar los IDs al carrusel */}
                    </div>
                </>
            )}
            <hr/>
            <div className="platform-section">
                <div className="platform-content">
                    {/* Parte izquierda: Palabra "Selecciona" centrada verticalmente */}
                    <div className="platform-left">
                        <Typography
                            variant="h1"
                            sx={{color: "white", fontSize: "3rem", textAlign: "center"}}
                        >
                            Selecciona
                        </Typography>
                    </div>

                    {/* Parte derecha: Cuadrícula de imágenes 3x3 */}
                    <div className="platform-right">
                        <div className="platform-grid">
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://www.netflix.com", "_blank")}
                            >
                                <img src={netflix}/>
                            </button>
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://www.max.com", "_blank")}
                            >
                                <img src="./images/max.jpg" alt="Max"/>
                            </button>
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://www.hulu.com", "_blank")}
                            >
                                <img src="./images/hulu.jpg" alt="Hulu"/>
                            </button>
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://www.paramountplus.com", "_blank")}
                            >
                                <img src="./images/paramount.jpg" alt="Paramount+"/>
                            </button>
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://www.primevideo.com", "_blank")}
                            >
                                <img src="./images/prine.jpg" alt="Prime Video"/>
                            </button>
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://www.peacocktv.com", "_blank")}
                            >
                                <img src="./images/pea.jpg" alt="Peacock"/>
                            </button>
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://www.disneyplus.com", "_blank")}
                            >
                                <img src="./images/disney.jpg" alt="Disney+"/>
                            </button>
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://tv.apple.com", "_blank")}
                            >
                                <img src="./images/apple.jpg" alt="Apple TV"/>
                            </button>
                            <button
                                className="platform-button"
                                onClick={() => window.open("https://www.crunchyroll.com", "_blank")}
                            >
                                <img src="./images/crunchy.jpg" alt="Crunchyroll"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <TestFirebase/>
        </div>
    );
}
