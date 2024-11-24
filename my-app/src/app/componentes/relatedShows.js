"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RelatedShows() {
  const [shows, setShows] = useState([]); // Lista de series (incluyendo la aleatoria y las relacionadas)
  const router = useRouter();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch("https://api.tvmaze.com/shows");
        const allShows = await response.json();

        // Seleccionar una serie al azar
        const randomIndex = Math.floor(Math.random() * allShows.length);
        const selectedShow = allShows[randomIndex];

        // Filtrar series con géneros similares
        const matchingShows = allShows.filter((show) => {
          return (
            show.id !== selectedShow.id && // Excluir la serie seleccionada
            show.genres &&
            selectedShow.genres.some((genre) => show.genres.includes(genre))
          );
        });

        // Seleccionar hasta 5 series al azar de las filtradas
        const randomMatchingShows = matchingShows
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        // Agregar la serie aleatoria al principio de la lista
        setShows([selectedShow, ...randomMatchingShows]);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchShows();
  }, []);

  const handleShowClick = (id) => {
    router.push(`/series/${id}`); // Redirigir a la página de detalles de la serie
  };

  if (shows.length === 0) {
    return <p>Loading...</p>; // Mostrar mensaje de carga inicial
  }

  return (
    <div>
      <h2>Series Relacionadas</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {shows.map((show) => (
          <div
            key={show.id}
            onClick={() => handleShowClick(show.id)}
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              maxWidth: "200px",
            }}
          >
            <img
              src={show.image?.medium || "https://via.placeholder.com/210x295"}
              alt={show.name}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ fontSize: "18px", marginBottom: "5px" }}>{show.name}</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>
              Géneros: {show.genres.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
