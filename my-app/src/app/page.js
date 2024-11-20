"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import NavBar from "./componentes/NavBar";
import ShowList from "./componentes/ShowList";
import MovieCarrusel from "./componentes/MovieCarrusel";
import LoadingScreen from "./componentes/LoadingScreen";
import TestFirebase from "./componentes/TestFirebase";

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
                        <MovieCarrusel showIds={showIds} /> {/* Pasar los IDs al carrusel */}
                    </div>
                </>
            )}
            <hr />
            <div style={{ backgroundColor: "black", width: "100vw", height: "100vh" }}>
                <Typography sx={{ color: "white" }}>Texto</Typography>
            </div>
            <TestFirebase />
        </div>
    );
}

