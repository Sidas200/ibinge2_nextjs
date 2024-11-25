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
                backgroundColor: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <CircularProgress style={{ color: 'white' }} />
        </Box>
    );
};

export default LoadingScreen;
