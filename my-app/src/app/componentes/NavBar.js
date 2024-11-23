"use client";
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import SearchBar from "./SearchBar";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import './nav_bar.css';

const NavBar = ({ onSearch }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Verificar si la cookie `authToken` está presente
        const token = Cookies.get("authToken");
        setIsLoggedIn(!!token); // Si existe el token, isLoggedIn será true
    }, []);

    const handleSearch = (query) => {
        if (query.trim()) {
            router.push(`/results?query=${encodeURIComponent(query)}`);
        }
    };

    const handleLogout = () => {
        // Eliminar la cookie y redirigir al usuario
        Cookies.remove("authToken");
        setIsLoggedIn(false); // Actualizar estado
        router.push("/login"); // Redirigir a la página de login
    };

    return (
        <AppBar position="fixed" className="fondo" sx={{ boxShadow: 'none', background: 'transparent' }}>
            <Toolbar>
                <Box display="flex" marginRight="200px">
                    <SearchBar onSearch={handleSearch} />
                </Box>
                <Box display="flex" sx={{ color: "black", marginLeft: 'auto' }}>
                    <Typography variant="h6" sx={{ marginRight: '16px' }}>iB</Typography>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: '16px' }}>
                        Inicio
                    </Link>
                    {isLoggedIn ? (
                        <>
                        <Button onClick={handleLogout} style={{ color: 'inherit' }}>
                            Cerrar sesión
                        </Button>
                        <Link href="/perfil" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Perfil
                        </Link>
                        </>
                    ) : (
                        <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Login
                        </Link>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
