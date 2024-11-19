"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import NavBar from "@/app/componentes/NavBar";
import ShowList from "@/app/componentes/ShowList";
import MovieCarousel from "@/app/componentes/MovieCarrusel";
import LoadingScreen from "@/app/componentes/LoadingScreen";
import TestFirebase from "@/app/componentes/TestFirebase";

export default function Home() {
    const [showIds, setShowIds] = useState([]);
    const [loading, setLoading] = useState(false); // Estado para manejar la carga
    const [showNavBar, setShowNavBar] = useState(false); // Estado para controlar la visibilidad de la NavBar

    useEffect(() => {
        // Obtener el número total de shows y generar IDs aleatorios
        const fetchTotalShows = async () => {
            setLoading(true); // Iniciar la carga
            try {
                const response = await fetch('https://api.tvmaze.com/shows');
                const data = await response.json();
                const totalShows = data.length; // Número total de shows en la base de datos

                // Generar IDs aleatorios dentro del rango de 1 a totalShows
                const randomIds = await generateRandomIds(5, 1, totalShows); // Obtener 5 IDs aleatorios válidos
                // @ts-ignore
                setShowIds(randomIds);
            } catch (error) {
                console.error('Error fetching total shows:', error);
            } finally {
                // Esperar un segundo extra antes de finalizar la carga
                setTimeout(() => setLoading(false), 1000);
            }
        };

        fetchTotalShows();
    }, []);

    // Función para generar IDs aleatorios únicos y filtrar los que no tienen imagen o no existen
    const generateRandomIds = async (count: any, min: any, max:any) => {
        const ids = new Set();
        while (ids.size < count) {
            const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
            try {
                const response = await fetch('https://api.tvmaze.com/shows/${randomId}');
                const show = await response.json();

                // Verificar si el show tiene imagen y existe
                if (show && show.image) {
                    ids.add(randomId);
                }
            } catch (error) {
                console.warn('Show with ID ${randomId} not found or has no image.');
            }
        }
        return Array.from(ids);
    };

    const handleSearch = async (query:any) => {
        setLoading(true); // Iniciar la carga para la búsqueda
        try {
            const response = await fetch('https://api.tvmaze.com/search/shows?q=${query}');
            const data = await response.json();
            const ids = data
                .filter((show: { show: { image: any; }; }) => show.show.image) // Filtrar los que tienen imagen
                .map((show: { show: { id: any; }; }) => show.show.id); // Extraer los IDs de los resultados de búsqueda
            setShowIds(ids);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // Esperar un segundo extra antes de finalizar la carga
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        // Manejar el scroll para mostrar u ocultar la NavBar
        const handleScroll = () => {
            const carouselElement = document.querySelector('.movie-carousel');
            if (carouselElement) {
                const { top } = carouselElement.getBoundingClientRect();
                // Mostrar la NavBar si el usuario ha hecho scroll más allá del carrusel
                if (top <= window.innerHeight) {
                    setShowNavBar(true);
                } else {
                    setShowNavBar(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // @ts-ignore
    return (
        <div style={{ overflow: 'hidden' }}>
            <div className="ibinge">
                <Typography sx={{ color: 'white', fontSize: '100px' }}>iBinge</Typography>
            </div>
            <hr />
            {showNavBar && <NavBar onSearch={handleSearch} />} {/* Mostrar NavBar solo si showNavBar es true */}
            {loading && <LoadingScreen />} {/* Mostrar la pantalla de carga completa cuando está cargando */}
            {!loading && (
                <>
                    <div className="movie-carousel"> {/* Agrega la clase para detectar el scroll */}
                        <MovieCarousel showIds={showIds} /> {/* Pasar los IDs al carrusel */}
                    </div>
                    <ShowList shows={[]} /> {/* Puedes dejar esta lista vacía o usarla según sea necesario */}
                </>
            )}
            <hr />
            <div style={{ backgroundColor: 'black', width: '100vw', height: '100vh' }}>
                <Typography sx={{ color: 'white' }}>Texto</Typography>
            </div>
            <TestFirebase></TestFirebase>
        </div>
    );
}