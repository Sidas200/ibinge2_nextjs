import React from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({
  activeTab,
  seasons,
  seasonData,
  selectedSeason,
  onSeasonClick,
  onBackToSeasons,
  cast,
  rating,
  onClose
}) {
  return (
    <div className={`${styles.sidebar} ${activeTab ? styles.active : ''}`}>
      <button onClick={onClose} className={styles.closeButton}>✖</button>

      {activeTab === 'season' && !selectedSeason && seasons.length > 0 && (
        <div className={styles.series}>
          <h3 className={styles.heading}>Temporadas</h3>
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => onSeasonClick(season.id)}
              className={styles.button}
            >
              {season.name || `Temporada ${season.number}`}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'season' && selectedSeason && (
        <div className={styles.episodes}>
          
          <h3 className={styles.heading}>{`Temporada ${selectedSeason.number}`}</h3>
          {seasonData.length > 0 ? (
            seasonData.map((episode) => (
              <p className={styles.cast} key={episode.id}>{episode.name}</p>
            ))
          ) : (
            <p>No hay episodios disponibles</p>
          )}
          <button onClick={onBackToSeasons} className={styles.backButton}>Regresar</button>
        </div>
        
      )}

      {activeTab === 'cast' && cast.length > 0 && (
        <div className={styles.names} >
          <h3 className={styles.heading}>Elenco</h3>
          {cast.map((member) => (
            <p className={styles.cast}key={member.id}>{member.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}
