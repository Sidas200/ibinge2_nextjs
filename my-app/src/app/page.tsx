// src/pages/index.js
"use client";
import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import NavBar from "@/app/componentes/NavBar";
import ShowList from "@/app/componentes/ShowList";
import MovieCarousel from "@/app/componentes/MovieCarrusel";
import LoadingScreen from "@/app/componentes/LoadingScreen"; // Importar el componente de pantalla de carga

export default function Home() {
    const [showIds, setShowIds] = useState([]);
    const [loading, setLoading] = useState(false); // Estado para manejar la carga

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
    const generateRandomIds = async (count:any, min:any, max:any) => {
        const ids = new Set();
        while (ids.size < count) {
            const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
            try {
                const response = await fetch(`https://api.tvmaze.com/shows/${randomId}`);
                const show = await response.json();

                // Verificar si el show tiene imagen y existe
                if (show && show.image) {
                    ids.add(randomId);
                }
            } catch (error) {
                console.warn(`Show with ID ${randomId} not found or has no image.`);
            }
        }
        return Array.from(ids);
    };

    const handleSearch = async (query:any) => {
        setLoading(true); // Iniciar la carga para la búsqueda
        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
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

    return (
        <Container>
            <NavBar onSearch={handleSearch} />
            {loading && <LoadingScreen />} {/* Mostrar la pantalla de carga completa cuando está cargando */}
            {!loading && (
                <>
                    <MovieCarousel showIds={showIds} /> {/* Pasar los IDs al carrusel */}
                    <ShowList shows={[]} /> {/* Puedes dejar esta lista vacía o usarla según sea necesario */}
                </>
            )}
        </Container>
    );
}






