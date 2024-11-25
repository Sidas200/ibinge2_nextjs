"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import styles from "./RelatedShows.module.css";

export default function RelatedShows() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showId = searchParams.get("showId");

  const [showDetails, setShowDetails] = useState(null);
  const [relatedShows, setRelatedShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShowDetails = async (id) => {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
      const data = await response.json();
      setShowDetails(data);
      fetchRelatedShowsByGenresAndCategory(data.genres, data.type, id);
    } catch (error) {
      console.error("Error al obtener los detalles de la serie:", error);
    }
  };

  const fetchRelatedShowsByGenresAndCategory = async (genres, type, excludedId) => {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows`);
      const data = await response.json();

      const filteredShows = data
        .filter((show) => show.type === type)
        .filter((show) => show.id !== excludedId)
        .map((show) => ({
          id: show.id,
          name: show.name,
          image: show.image?.medium || 'fallback_image_url',
          genres: show.genres || [],
          type: show.type || 'Unknown',
        }))
        .filter((show) => genres.some((genre) => show.genres.includes(genre)));

      const shuffledShows = shuffleArray(filteredShows);
      const randomShows = shuffledShows.slice(0, 3);

      setRelatedShows(randomShows);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener las series relacionadas:", error);
      setIsLoading(false);
    }
  };

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (showId) {
      fetchShowDetails(showId);
    }
  }, [showId]);

  return (
    <div className={styles.rsback}>
      <div className={styles.container}>
        <h1 className={styles.title}>Series Relacionadas</h1>

        {isLoading ? (
          <p>Cargando series relacionadas...</p>
        ) : relatedShows.length === 0 ? (
          <p>No se encontraron series relacionadas.</p>
        ) : (
          <div className={styles.cardContainer}>
            {relatedShows.map((show) => (
              <Link href={`/series/${show.id}`} key={show.id}>
                <div className={styles.card}>
                  <img src={show.image} alt={show.name} className={styles.cardImage} />
                  <h3 className={styles.cardTitle}>{show.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
