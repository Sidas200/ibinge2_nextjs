"use client";
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "../nav_bar.css";

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("authToken");
        setIsLoggedIn(!!token); // Actualiza el estado según la existencia del token
    }, []);

    const handleSearch = (query) => {
        if (query.trim()) {
            router.push(`/results?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <AppBar
            position="fixed"
            className="fondo"
            sx={{
                boxShadow: "none",
                background: "transparent",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box display="flex">
                    <SearchBar onSearch={handleSearch} />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ flexGrow: 1 }}
                >
                    <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                marginRight:"150px",
                                color: "black",
                            }}
                        >
                            iB
                        </Typography>
                    </Link>
                </Box>
                <Box display="flex" sx={{ color: "black" }}>
                    {isLoggedIn ? (
                        <Link
                            href="/perfil"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            Perfil
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            Login
                        </Link>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
