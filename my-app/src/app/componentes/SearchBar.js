"use client";
// src/app/componentes/SearchBar.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        if (query.trim() && onSearch) {  // Ensure onSearch is defined
            onSearch(query);  // Trigger the search function passed as a prop
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Ejecutar la búsqueda cuando se presiona Enter
        }
    };

    return (
        <Box display="flex" justifyContent="center">
            <TextField
                label="Buscar"
                variant="outlined"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}  // Detectar la tecla Enter
                sx={{ backgroundColor: 'white' }}  // Ensure background is white
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{ marginLeft: 2 }}
            >
                Buscar
            </Button>
        </Box>
    );
};

export default SearchBar;
