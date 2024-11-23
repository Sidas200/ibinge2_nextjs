"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MovieCarrusel.css";

const MovieCarrusel = ({ showIds, totalToShow }) => {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const showPromises = showIds.map((id) =>
                    fetch(`https://api.tvmaze.com/shows/${id}`)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Show with ID ${id} not found.`);
                            }
                            return response.json();
                        })
                        .catch((error) => {
                            console.error(`Error fetching show with ID ${id}:`, error);
                            return null;
                        })
                );

                const showsData = await Promise.all(showPromises);
                const validShows = showsData.filter((show) => show !== null && show.image);
                setShows(validShows);
            } catch (error) {
                console.error("Error fetching shows:", error);
            }
        };

        if (showIds && showIds.length > 0) {
            fetchShows();
        }
    }, [showIds]);

    const settings = {
        dots: false, // Eliminar los puntos de navegación
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
                    No shows available
                </p>
            )}
        </div>
    );
};

export default MovieCarrusel;

