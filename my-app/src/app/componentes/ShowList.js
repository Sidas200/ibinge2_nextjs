"use client";
import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

function ShowList({ shows }) {
    return (
        <Grid container spacing={3} sx={{marginTop:'50px'}}>
            {shows.map((show, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card>
                        {show.show.image && (
                            <CardMedia
                                component="img"
                                height="300"
                                image={show.show.image.medium}
                                alt={show.show.name}
                            />
                        )}
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {show.show.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {show.show.genres.join(', ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {show.show.premiered}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default ShowList;
