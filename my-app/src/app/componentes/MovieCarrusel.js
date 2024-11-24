"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { auth, db } from "../../firebase"; // Asegúrate de importar correctamente Firebase
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
                // Obtener un conjunto amplio de series desde la API
                const response = await fetch(`https://api.tvmaze.com/shows`);
                if (!response.ok) {
                    throw new Error("Error al obtener las series.");
                }

                const allShows = await response.json();

                let filteredShows;

                if (favoriteGenres.length > 0) {
                    // Filtrar las series por los géneros favoritos
                    filteredShows = allShows.filter((show) =>
                        show.genres.some((genre) => favoriteGenres.includes(genre))
                    );
                } else {
                    // Obtener series aleatorias
                    filteredShows = allShows
                        .sort(() => Math.random() - 0.5) // Mezclar aleatoriamente
                        .slice(0, 20); // Limitar el número de series a mostrar
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
        slidesToShow: totalToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="midpage">
            <h1>¿Ya viste...?</h1>
            <div className="movie-carousel-container">
                {shows.length > 0 ? (
                    <Slider {...settings}>
                        {shows.map((show) => (
                            <Link key={show.id} href={`/series/${show.id}`} passHref>
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
                        ))}
                    </Slider>
                ) : (
                    <p style={{ textAlign: "center", color: "#000", marginTop: "20px" }}>
                        No hay series disponibles.
                    </p>
                )}
            </div>
        </div>

    );
};

export default MovieCarrusel;




