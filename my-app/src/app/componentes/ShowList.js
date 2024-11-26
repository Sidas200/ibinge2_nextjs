"use client";
import React from "react";
import Link from "next/link";
import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";

function ShowList({ shows }) {
    return (
        <Grid
            container
            spacing={4}
            sx={{
                marginTop: "50px",
                paddingLeft: "1%",
                paddingRight: "1%",
            }}
        >
            {Array.isArray(shows) && shows.length > 0 ? (
                shows.map((result, index) => {
                    const show = result.show || result;
                    return (
                        <Grid item key={show.id || index} xs={12} sm={6} md={4} lg={3}>
                            <Link href={`/series/${show.id}`} passHref>
                                <Card
                                    component="a"
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        textDecoration: "none",
                                        boxShadow: 3,
                                        "&:hover": {
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    {show.image && show.image.medium ? (
                                        <CardMedia
                                            component="img"
                                            image={show.image.medium}
                                            alt={show.name || "Imagen no disponible"}
                                            sx={{
                                                height: 250,
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: 250,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "#ccc",
                                            }}
                                        >
                                            <Typography variant="body2" color="text.secondary">
                                                Imagen no disponible
                                            </Typography>
                                        </div>
                                    )}

                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            noWrap
                                            sx={{ fontWeight: "bold", textAlign: "center" }}
                                        >
                                            {show.name || "Título no disponible"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textAlign: "center", marginTop: 1 }}
                                        >
                                            {show.genres && show.genres.length > 0
                                                ? `Géneros: ${show.genres.join(", ")}`
                                                : "Género no disponible"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textAlign: "center", marginTop: 1 }}
                                        >
                                            {show.premiered
                                                ? `Estrenado: ${show.premiered}`
                                                : "Fecha no disponible"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    );
                })
            ) : (
                <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                    sx={{ width: "100%", marginTop: "20px" }}
                >
                    No se encontraron resultados.
                </Typography>
            )}
        </Grid>
    );
}

export default ShowList;


