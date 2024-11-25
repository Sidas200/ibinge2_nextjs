"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import NavBar from "./componentes/NavBar";
import MovieCarrusel from "./componentes/MovieCarrusel";
import LoadingScreen from "./componentes/LoadingScreen";
import styles from "./componentes/NavBar.module.css";

export default function Home() {
    const [showIds, setShowIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNavBar, setShowNavBar] = useState(false);
    const totalShows = 15;
    const totalToShow = 5;

    useEffect(() => {
        const fetchTotalShows = async () => {
            try {
                const response = await fetch("https://api.tvmaze.com/shows");
                const data = await response.json();
                const totalShowsAvailable = data.length;

                const newIds = generateUniqueRandomIds(totalShows, 1, totalShowsAvailable, []);
                setShowIds(newIds);
            } catch (error) {
                console.error("Error fetching total shows:", error);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };

        fetchTotalShows();
    }, []);

    const generateUniqueRandomIds = (count, min, max, exclude) => {
        const ids = new Set();
        while (ids.size < count) {
            const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!exclude.includes(randomId)) {
                ids.add(randomId);
            }
        }
        return Array.from(ids);
    };

    const handleSearch = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            const data = await response.json();
            const ids = data
                .filter((result) => result.show.image)
                .map((result) => result.show.id);
            setShowIds(ids.slice(0, totalShows));
        } catch (error) {
            console.error("Error searching shows:", error);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const carouselElement = document.querySelector(".movie-carousel");
            if (carouselElement) {
                const { top } = carouselElement.getBoundingClientRect();
                setShowNavBar(top <= window.innerHeight);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div style={{ overflow: "hidden" }}>
            <div className="ibinge">
                <Typography sx={{ color: "white", fontSize: "100px" }}>iBinge</Typography>
            </div>
            <hr />
            {showNavBar && <NavBar onSearch={handleSearch} />}
            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    <div className="movie-carousel">
                        <MovieCarrusel showIds={showIds} totalToShow={totalToShow} />
                    </div>
                </>
            )}
            <hr />
            <div className="platform-section">
                <div className="platform-content">
                    {/* Parte derecha */}
                    <div className="platform-right">
                        <div className="platform-grid">
                            <button
                                className="platform-button platform-netflix"
                                onClick={() => window.open("https://www.netflix.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-max"
                                onClick={() => window.open("https://www.max.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-hulu"
                                onClick={() => window.open("https://www.hulu.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-paramount"
                                onClick={() => window.open("https://www.paramountplus.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-primevideo"
                                onClick={() => window.open("https://www.primevideo.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-peacock"
                                onClick={() => window.open("https://www.peacocktv.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-disney"
                                onClick={() => window.open("https://www.disneyplus.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-apple"
                                onClick={() => window.open("https://tv.apple.com", "_blank")}
                            ></button>
                            <button
                                className="platform-button platform-crunchyroll"
                                onClick={() => window.open("https://www.crunchyroll.com", "_blank")}
                            ></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
