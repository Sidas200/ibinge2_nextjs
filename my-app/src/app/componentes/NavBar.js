// src/app/componentes/NavBar.js
"use client";
import React from 'react';
import { AppBar, Toolbar, Typography, MenuItem, Box } from '@mui/material';
import SearchBar from "@/app/componentes/SearchBar";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import './nav_bar.css';

const NavBar = ({ onSearch }) => {
    const router = useRouter();

    const handleSearch = (query) => {
        if (query.trim()) {
            // Redirigir a la página de resultados con el término de búsqueda como parámetro de consulta
            router.push(`/results?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <AppBar position="fixed" style={{ boxShadow: 'inherit' }} className="fondo">
            <Toolbar>
                {/* Search Bar */}
                <Box flexGrow={1} display="flex">
                    <SearchBar onSearch={handleSearch} />
                </Box>

                {/* Center Logo */}
                <Box flexGrow={1} display="flex" justifyContent="center">
                    <Typography variant="h6" noWrap component="div" sx={{ color: 'black' }}>
                        iB
                    </Typography>
                </Box>

                {/* Menu items */}
                <Box display="flex" sx={{color:"black"}}>
                    <MenuItem>
                        <Link href="/">Inicio</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href="/login">Login</Link>
                    </MenuItem>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;


