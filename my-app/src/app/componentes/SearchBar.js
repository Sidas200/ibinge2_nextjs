"use client";
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const SearchBar = ({ onSearch, className }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        if (query.trim() && onSearch) {
            onSearch(query);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box display="flex" justifyContent="center" className={className}>
            <TextField
                label="Buscar"
                variant="outlined"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                sx={{ backgroundColor: 'white' }}
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
