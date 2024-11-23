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
        const fetchShowsByGenres = async () => {
            if (favoriteGenres.length === 0) return;

            try {
                const showPromises = favoriteGenres.map((genre) =>
                    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(genre)}`)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Error fetching shows for genre ${genre}`);
                            }
                            return response.json();
                        })
                        .catch((error) => {
                            console.error(`Error fetching shows for genre ${genre}:`, error);
                            return [];
                        })
                );

                const showsData = await Promise.all(showPromises);

                // Filtrar y combinar resultados
                const validShows = showsData
                    .flat() // Aplanar los resultados
                    .map((result) => result.show) // Extraer el objeto `show`
                    .filter((show) => show && show.image); // Filtrar solo los shows con imágenes

                setShows(validShows);
            } catch (error) {
                console.error("Error al obtener series:", error);
            }
        };

        fetchShowsByGenres();
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
                    No hay series disponibles para tus géneros favoritos.
                </p>
            )}
        </div>
    );
};

export default MovieCarrusel;


