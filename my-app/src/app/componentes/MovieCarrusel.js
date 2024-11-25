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

    useEffect(() => {
        const fetchFavoriteGenres = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    console.warn("El usuario no ha iniciado sesión.");
                    return;
                }

                // Obtener los favoritos del usuario
                const q = query(
                    collection(db, "favorites"),
                    where("userId", "==", currentUser.uid)
                );
                const querySnapshot = await getDocs(q);

                // Extraer géneros de los favoritos
                const genres = querySnapshot.docs
                    .map((doc) => doc.data().genres)
                    .flat(); // Aplanar para combinar todos los arrays de géneros
                const uniqueGenres = [...new Set(genres)]; // Eliminar duplicados
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
                if (!response.ok) {
                    throw new Error("Error al obtener las series.");
                }

                const allShows = await response.json();

                let filteredShows;

                if (favoriteGenres.length > 0) {
                    filteredShows = allShows.filter((show) =>
                        show.genres.some((genre) => favoriteGenres.includes(genre))
                    );
                } else {
                    filteredShows = allShows
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 20);
                }

                setShows(filteredShows);
            } catch (error) {
                console.error("Error al obtener series:", error);
            }
        };

        fetchShows();
    }, [favoriteGenres]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="midpage">
            <h1 className="texto">Seleccinados para tí</h1>
            <div className="movie-carousel-container">
                {shows.length > 0 ? (
                    <Slider {...settings} className="slider-wrapper">
                        {shows.map((show) => (
                            <div key={show.id} className="slider-item">
                                <Link href={`/series/${show.id}`} passHref>
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




