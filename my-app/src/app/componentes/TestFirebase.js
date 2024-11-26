
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Typography, Box } from '@mui/material';

const TestFirebase = () => {
    const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const seriesCollection = collection(db, 'Series');
                const seriesSnapshot = await getDocs(seriesCollection);
                const seriesList = seriesSnapshot.docs.map(doc => doc.data());
                console.log("Datos obtenidos de Firebase:", seriesList);
                setSeriesData(seriesList);
            } catch (error) {
                console.error("Error al obtener datos de Firebase:", error);
            }
        };

        fetchSeries();
    }, []);

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4">Prueba de Firebase</Typography>
            {seriesData.length > 0 ? (
                seriesData.map((serie, index) => (
                    <Box key={index} sx={{ marginTop: '10px', color:'black' }}>
                        <Typography variant="h6">Nombre: {serie.Nombre || 'No disponible'}</Typography>
                        <Typography>Genero: {serie.Genero || 'No disponible'}</Typography>
                        <Typography>Edad: {serie.Edad || 'No disponible'}</Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body1">No se encontraron series en la base de datos.</Typography>
            )}
        </Box>
    );
};

export default TestFirebase;
