"use client";
import React, { useEffect, useState } from 'react';
import SearchBar from "./SearchBar";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import styles from './NavBar.module.css';

const NavBar = ({ onSearch }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("authToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleSearch = (query) => {
        if (query.trim()) {
            router.push(`/results?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className={styles.fondo}>
            <div className={styles.content}>
                <SearchBar className={styles.search} onSearch={handleSearch} />
                <div className={styles.logo}>
                    <Link href="/">
                        <span>iB</span>
                    </Link>
                </div>
                <div className={styles.account}>
                    {isLoggedIn ? (
                        <Link href="/perfil" className={styles.link}>
                            Cuenta
                        </Link>
                    ) : (
                        <Link href="/login" className={styles.link}>
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
