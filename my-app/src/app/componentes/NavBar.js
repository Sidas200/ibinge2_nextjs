"use client";
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import SearchBar from "./SearchBar";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import './nav_bar.css';

const NavBar = ({ onSearch }) => {
    const router = useRouter();

    const handleSearch = (query) => {
        if (query.trim()) {
            router.push(`/results?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <AppBar position="fixed" className="fondo" sx={{ boxShadow: 'none', background: 'transparent' }}>
            <Toolbar>
                <Box flexGrow={1} display="flex" justifyContent="center">
                    <SearchBar onSearch={handleSearch} />
                </Box>
                <Box display="flex" sx={{ color: "black", marginLeft: 'auto' }}>
                    <Typography variant="h6" sx={{ marginRight: '16px' }}>iB</Typography>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: '16px' }}>
                        Inicio
                    </Link>
                    <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Login
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
