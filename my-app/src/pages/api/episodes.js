// Sidebar.js
"use client";
import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ activeTab, seasons, cast, rating, onClose }) {
  const [selectedSeason, setSelectedSeason] = useState(null);

  const handleSeasonClick = (seasonIndex) => {
    setSelectedSeason(seasonIndex === selectedSeason ? null : seasonIndex);
  };

  useEffect(() => {
    console.log("Active Tab:", activeTab);
    console.log("Seasons in Sidebar:", seasons);
  }, [activeTab, seasons]);

  return (
    <div className={`${styles.sidebar} ${activeTab ? styles.active : ''}`}>
      <button onClick={onClose} className={styles.closeButton}>Cerrar</button>

      {activeTab === 'season' && seasons.length > 0 ? (
        <div>
          <h2>Temporadas</h2>
          {seasons.map((season, index) => (
            <div key={index}>
              <h3 onClick={() => handleSeasonClick(index)}>
                {`Temporada ${season.number}`}
              </h3>

              {/* Mostrar episodios solo si la temporada está seleccionada */}
              {selectedSeason === index && season.episodes?.length > 0 ? (
                season.episodes.map((episode, epIndex) => (
                  <p key={epIndex} className={styles.episode}>{episode.name}</p>
                ))
              ) : selectedSeason === index && (
                <p>No hay episodios disponibles</p>
              )}
            </div>
          ))}
        </div>
      ) : activeTab === 'season' && (
        <p>No hay temporadas disponibles</p>
      )}

      {activeTab === 'cast' && cast.length > 0 && (
        <div>
          <h2>Reparto</h2>
          {cast.map((actor, index) => (
            <p key={index}>{actor.name} - {actor.character}</p>
          ))}
        </div>
      )}

      {activeTab === 'cast' && cast.length === 0 && (
        <p>No hay información de reparto disponible</p>
      )}

      {activeTab === 'rating' && rating && (
        <div>
          <h2>Rating</h2>
          <p>{rating.average}</p>
        </div>
      )}

      {activeTab === 'rating' && !rating && (
        <p>Rating no disponible</p>
      )}
    </div>
  );
}
