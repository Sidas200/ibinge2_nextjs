"use client";
import React from 'react';
import Link from 'next/link';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import styles from './ShowList.module.css'; // Asegúrate de que el archivo esté en la misma carpeta

function ShowList({ shows }) {
    return (
        <Grid container spacing={4} sx={{ marginTop: '50px', paddingLeft: '1%', paddingRight: '1%' }}>
            {shows.length > 0 ? (
                shows.map((show, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
                        <Link href={`/series/${show.show.id}`} passHref>
                            <Card className={styles.card} component="a">
                                {show.show.image && (
                                    <CardMedia
                                        component="img"
                                        className={styles.cardImage}
                                        image={show.show.image.medium}
                                        alt={show.show.name}
                                    />
                                )}
                                <CardContent className={styles.cardContent}>
                                    <Typography variant="h6" component="div" className={styles.cardTitle}>
                                        {show.show.name}
                                    </Typography>
                                    <Typography variant="body2" className={styles.cardSubtitle}>
                                        {show.show.genres.join(', ') || 'Género no disponible'}
                                    </Typography>
                                    <Typography variant="body2" className={styles.cardSubtitle}>
                                        {show.show.premiered || 'Fecha no disponible'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))
            ) : (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ width: '100%' }}>
                    No se encontraron resultados.
                </Typography>
            )}
        </Grid>
    );
}

export default ShowList;
