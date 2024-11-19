"use client";
import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="search-bar-container">
            <TextField
                placeholder="Buscar series..."
                variant="standard"
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon className="search-icon" />
                        </InputAdornment>
                    ),
                }}
                fullWidth
                className="custom-search-bar"
            />
        </div>
    );
};

export default SearchBar;
