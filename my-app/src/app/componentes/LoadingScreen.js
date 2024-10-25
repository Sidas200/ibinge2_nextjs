// src/app/componentes/LoadingScreen.js
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingScreen = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#000', // Fondo negro opaco
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999, // Asegura que esté por encima de otros elementos
            }}
        >
            <CircularProgress style={{ color: 'white' }} /> {/* Indicador de carga blanco */}
        </Box>
    );
};

export default LoadingScreen;
