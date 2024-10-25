// src/pages/results.js
"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Para obtener los parámetros de la URL
import { Container, Typography } from '@mui/material';
import NavBar from "../componentes/NavBar";
import ShowList from "../componentes/ShowList";

export default function Results() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query'); // Obtener el término de búsqueda desde la URL
    const [shows, setShows] = useState([]);

    useEffect(() => {
        if (query) {
            // Ejecutar la búsqueda con el término de consulta actual
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (searchQuery) => {
        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchQuery}`);
            const data = await response.json();
            setShows(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Container>
            <NavBar onSearch={handleSearch} />
            <Typography variant="h3" align="center" marginY={4} marginTop={20} color="black">
                Resultados de Búsqueda
            </Typography>
            <ShowList shows={shows} />
        </Container>
    );
}
