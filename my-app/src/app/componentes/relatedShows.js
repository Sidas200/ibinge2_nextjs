"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./RelatedShows.module.css";

export default function RelatedShows({ showDetails }) {
  const router = useRouter();
  const [similarShows, setSimilarShows] = useState([]);

  // Fetch para obtener series similares
  useEffect(() => {
    const fetchSimilarShows = async () => {
      try {

        if (!showDetails.genres || showDetails.genres.length === 0) {
          console.warn("No genres available for recommendations.");
          setSimilarShows([]);
          return;
        }

        const showPromises = showDetails.genres.map((genre) =>
          fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(genre)}`)
            .then((response) => response.json())
            .catch((error) => {
              console.error(`Error fetching shows for genre ${genre}:`, error);
              return [];
            })
        );

        const showsData = await Promise.all(showPromises);

        const filteredShows = showsData
          .flat()
          .map((result) => result.show)
          .filter(
            (show) =>
              show &&
              show.id !== showDetails.id && // Excluir el show actual
              show.image && // Solo incluir shows con imagen
              show.genres.some((genre) => showDetails.genres.includes(genre)) // Coinciden en género
          );

        const randomShows = filteredShows.sort(() => 0.5 - Math.random()).slice(0, 3);

        setSimilarShows(randomShows);
      } catch (error) {
        console.error("Error fetching similar shows:", error);
      }
    };

    fetchSimilarShows();
  }, [showDetails.id, showDetails.genres]);

  const handleShowClick = (id) => {
    router.push(`/series/${id}`); // Redirigir a la página de detalles de la serie
  };

  return (
    <div className={styles.similarShows}>
      <h2>Series relacionadas</h2>
      <div className={styles.showList}>
        {similarShows.map((show) => (
          <div
            key={show.id}
            className={styles.showCard}
            onClick={() => handleShowClick(show.id)}
            style={{ cursor: "pointer" }}
          >
            <img src={show.image?.medium || "fallback_image_url"} alt={show.name} />
            <h3>{show.name}</h3>
            <p>{show.genres.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
