"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MovieCarrusel.css";

const MovieCarrusel = ({ totalToShow }) => {
    const [favoriteGenres, setFavoriteGenres] = useState([]);
    const [shows, setShows] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const fetchFavoriteGenres = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                const q = query(
                    collection(db, "favorites"),
                    where("userId", "==", currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const genres = querySnapshot.docs
                    .map((doc) => doc.data().genres)
                    .flat();
                const uniqueGenres = [...new Set(genres)];
                setFavoriteGenres(uniqueGenres);
            } catch (error) {
                console.error("Error al obtener géneros favoritos:", error);
            }
        };

        fetchFavoriteGenres();
    }, []);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await fetch(`https://api.tvmaze.com/shows`);
                if (!response.ok) throw new Error("Error al obtener las series.");

                const allShows = await response.json();
                let filteredShows = [];

                if (favoriteGenres.length > 0) {
                    const scoredShows = allShows.map((show) => {
                        const score = show.genres.reduce((acc, genre) => {
                            if (favoriteGenres.includes(genre)) {
                                return acc + 1;
                            }
                            return acc;
                        }, 0);
                        return { ...show, score };
                    });

                    filteredShows = scoredShows
                        .filter((show) => show.score > 0)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, totalToShow || 20);
                }

                if (filteredShows.length < (totalToShow || 20)) {
                    const randomShows = allShows
                        .filter((show) => !filteredShows.includes(show))
                        .sort(() => Math.random() - 0.5)
                        .slice(0, (totalToShow || 20) - filteredShows.length);
                    filteredShows = [...filteredShows, ...randomShows];
                }

                setShows(filteredShows);
            } catch (error) {
                console.error("Error al obtener series:", error);
            }
        };

        fetchShows();
    }, [favoriteGenres, totalToShow]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        beforeChange: () => setIsDragging(true),
        afterChange: () => setTimeout(() => setIsDragging(false), 100),
    };

    return (
        <div className="midpage">
            <h1 className="texto">Seleccionados para ti</h1>
            <div className="movie-carousel-container">
                {shows.length > 0 ? (
                    <Slider {...settings} className="slider-wrapper">
                        {shows.map((show) => (
                            <div key={show.id} className="slider-item">
                                <Link
                                    href={`/series/${show.id}`}
                                    passHref
                                    onClick={(e) => {
                                        if (isDragging) e.preventDefault();
                                    }}
                                >
                                    <div className="movie-card">
                                        {show.image && show.image.medium ? (
                                            <img
                                                className="movie-card-media"
                                                src={show.image.medium}
                                                alt={show.name || "Imagen no disponible"}
                                            />
                                        ) : (
                                            <div className="movie-card-placeholder">
                                                <p>Imagen no disponible</p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div className="movie-card-placeholder">
                        <p>No hay series disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieCarrusel;





