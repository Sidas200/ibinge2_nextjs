"use client";
import React, { useState } from 'react';
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
            <input
                type="text"
                placeholder="Buscar series"
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="custom-search-bar"
            />
        </div>
    );
};

export default SearchBar;
