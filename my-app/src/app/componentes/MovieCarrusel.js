// src/app/componentes/MovieCarousel.js
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieCarousel = ({ showIds }) => {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                // Obtener los detalles de cada show por ID
                const showPromises = showIds.map(id =>
                    fetch(`https://api.tvmaze.com/shows/${id}`).then(response => response.json())
                );
                const showsData = await Promise.all(showPromises);
                setShows(showsData);
            } catch (error) {
                console.error('Error fetching shows:', error);
            }
        };

        if (showIds.length > 0) {
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
        <div style={{marginTop:"70px"}}>
            {shows.length > 0 ? (
                <Slider {...settings}>
                    {shows.map((show) => (
                        <Card key={show.id} style={{ margin: '0 10px' }}>
                            {show.image ? (
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={show.image.medium}
                                    alt={show.name}
                                />
                            ) : (
                                <div style={{ height: 300, backgroundColor: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography>No Image Available</Typography>
                                </div>
                            )}
                            <CardContent>
                                <Typography variant="h6" component="div" align="center">
                                    {show.name || 'No Name Available'}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Slider>
            ) : (
                <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
                    No shows available
                </Typography>
            )}
        </div>
    );
};

export default MovieCarousel;

