"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./relatedShows.module.css";

export default function RelatedShows() {
  const [shows, setShows] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch("https://api.tvmaze.com/shows");
        const allShows = await response.json();

        const randomIndex = Math.floor(Math.random() * allShows.length);
        const selectedShow = allShows[randomIndex];

        const matchingShows = allShows.filter((show) => {
          return (
            show.id !== selectedShow.id &&
            show.genres &&
            selectedShow.genres.some((genre) => show.genres.includes(genre))
          );
        });

        const randomMatchingShows = matchingShows
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setShows([selectedShow, ...randomMatchingShows]);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchShows();
  }, []);

  const handleShowClick = (id) => {
    router.push(`/series/${id}`);
  };

  if (shows.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Te recomendamos</h1>
      <div className={styles.cardContainer}>
        {shows.map((show) => (
          <div
            key={show.id}
            onClick={() => handleShowClick(show.id)}
            className={styles.card}
          >
            <img
              src={show.image?.medium || "https://via.placeholder.com/210x295"}
              alt={show.name}
              className={styles.cardImage}
            />
            <h3 className={styles.cardTitle}>{show.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}