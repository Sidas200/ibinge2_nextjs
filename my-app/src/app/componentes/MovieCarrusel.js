"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import "./carrusel.css"; // Importamos el CSS modular
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieCarrusel = ({ showIds }) => {
    const [shows, setShows] = useState([]); // Estado para almacenar datos completos de los shows

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
                            return null; // Excluir shows con errores
                        })
                );

                const showsData = await Promise.all(showPromises);
                const validShows = showsData.filter((show) => show !== null && show.image); // Filtrar datos nulos y shows sin imagen
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
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="carruselContainer">
            {shows.length > 0 ? (
                <Slider {...settings}>
                    {shows.map((show) => (
                        <Link key={show.id} href={`/series/${show.id}`} passHref>
                            <Button component="a">
                                <Card className="card">
                                    {show.image && show.image.medium ? (
                                        <CardMedia
                                            component="img"
                                            height="300"
                                            image={show.image.medium}
                                            alt={show.name || "Imagen no disponible"}
                                            className="cardImage"
                                        />
                                    ) : (
                                        <div className="noImage">
                                            <Typography>Imagen no disponible</Typography>
                                        </div>
                                    )}
                                    <CardContent className="cardContent">
                                        <Typography variant="h6" component="div" align="center">
                                            {show.name || "No Name Available"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Button>
                        </Link>
                    ))}
                </Slider>
            ) : (
                <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
                    No shows available
                </Typography>
            )}
        </div>
    );
};

export default MovieCarrusel;

