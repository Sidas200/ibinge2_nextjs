"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import NavBar from "../componentes/NavBar";
import ShowList from "../componentes/ShowList";

export default function Page() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const [shows, setShows] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (searchQuery) => {
        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchQuery}`);
            if (!response.ok) throw new Error('Error fetching data');
            const data = await response.json();
            setShows(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Ocurrió un error al buscar series. Intenta de nuevo.');
        }
    };

    return (
        <Box
            sx={{ width: '100%', maxWidth: '1600px', margin: '20px auto', padding: '0 0.5%', paddingTop: '80px' }} // Ajuste de paddingTop
        >
            <NavBar onSearch={handleSearch} />
            <Typography
                variant="h3"
                align="center"
                marginY={4}
                sx={{
                    marginBottom: '20px',
                    background: 'linear-gradient(90deg, #4f46e5, #6b7280)', // Degradado de color
                    WebkitBackgroundClip: 'text', // Para que el degradado solo afecte al texto
                    WebkitTextFillColor: 'transparent', // Hace el fondo transparente y permite ver el degradado
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                    position: 'relative',
                    display: 'inline-block'
                }}
            >
                Resultados de Búsqueda
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#4f46e5', // Color de la línea de fondo
                        bottom: '-6px',
                        left: 0,
                        borderRadius: '2px',
                    }}
                />
            </Typography>
            {error ? (
                <Typography variant="body1" align="center" color="error">
                    {error}
                </Typography>
            ) : (
                <ShowList shows={shows} />
            )}
        </Box>
    );
}

