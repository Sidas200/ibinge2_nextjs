"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importamos el hook para redirección
import Sidebar from './Sidebar';
import styles from './SeriesDetails.module.css';

export default function SeriesDetails({ showDetails }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(null);
  const [seasonData, setSeasonData] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [cast, setCast] = useState([]);
  const [rating, setRating] = useState(showDetails.rating?.average || "N/A");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [similarShows, setSimilarShows] = useState([]);

  // Fetch para las imágenes del fondo
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`https://api.tvmaze.com/shows/${showDetails.id}/images`);
        const images = await response.json();
        const background =
            images.find(img => img.type === 'background') ||
            images.find(img => img.type === 'banner') ||
            images[0];

        if (background) {
          const img = new Image();
          img.src = background.resolutions?.original?.url || background.resolutions?.medium?.url;
          img.onload = () => {
            setBackgroundImage(img.src);
            setIsLoadingImage(false);
          };
        } else {
          setBackgroundImage(null);
          setIsLoadingImage(false);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setBackgroundImage(null);
        setIsLoadingImage(false);
      }
    };

    fetchImages();
  }, [showDetails.id]);

  // Fetch para obtener temporadas y elenco
  useEffect(() => {
    if (activeTab === 'season') {
      fetchSeasons();
    } else if (activeTab === 'cast') {
      fetchCast();
    }
  }, [activeTab]);

  const fetchSeasons = async () => {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${showDetails.id}/seasons`);
      const seasonsData = await response.json();
      setSeasons(seasonsData);
    } catch (error) {
      console.error("Error fetching seasons:", error);
    }
  };

  const fetchCast = async () => {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${showDetails.id}/cast`);
      const castData = await response.json();
      setCast(castData.map(member => member.person));
    } catch (error) {
      console.error("Error fetching cast:", error);
    }
  };

  // Fetch para obtener series similares
  useEffect(() => {
    const fetchSimilarShows = async () => {
      try {
        if (!showDetails.genres || showDetails.genres.length === 0) {
          console.warn("No genres available for recommendations.");
          setSimilarShows([]);
          return;
        }

        // Realizamos una búsqueda para cada género del show actual
        const showPromises = showDetails.genres.map((genre) =>
            fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(genre)}`)
                .then(response => response.json())
                .catch(error => {
                  console.error(`Error fetching shows for genre ${genre}:`, error);
                  return [];
                })
        );

        const showsData = await Promise.all(showPromises);

        // Filtrar y combinar resultados
        const filteredShows = showsData
            .flat()
            .map(result => result.show)
            .filter(
                show => 
                    show &&
                    show.id !== showDetails.id && // Excluir el show actual
                    show.image && // Solo incluir shows con imagen
                    show.genres.some(genre => showDetails.genres.includes(genre)) // Coinciden en género
            );

        // Seleccionar 3 series aleatorias
        const randomShows = filteredShows.sort(() => 0.5 - Math.random()).slice(0, 3);

        setSimilarShows(randomShows);
      } catch (error) {
        console.error("Error fetching similar shows:", error);
      }
    };

    fetchSimilarShows();
  }, [showDetails.id, showDetails.genres]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedSeason(null);
    setSeasonData([]);
  };

  const handleSeasonClick = async (seasonId) => {
    try {
      const response = await fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`);
      const episodes = await response.json();
      setSeasonData(episodes);
      setSelectedSeason(seasons.find(season => season.id === seasonId));
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

  const handleBackToSeasons = () => {
    setSelectedSeason(null);
    setSeasonData([]);
  };

  const handleCloseSidebar = () => {
    setActiveTab(null);
  };

  const handleShowClick = (id) => {
    router.push(`/series/${id}`); // Redirigir a la página de detalles de la serie
  };

  return (
      <div className={styles.seriesDetails}>
        {/* Fondo */}
        <div
            className={styles.background}
            style={{
              backgroundImage: isLoadingImage
                  ? 'url("fallback_loading_image_url")'
                  : `url(${backgroundImage || 'fallback_image_url'})`,
            }}
        />

        {/* Título */}
        <div className={styles.title}>
          <h1>{showDetails.name || "Loading..."}</h1>
        </div>

        {/* Botones */}
        <div className={styles.buttons}>
          <button onClick={() => handleTabClick('season')}>Temporadas</button>
          <h2 className={styles.rating}>{rating} ☆</h2>
          <button onClick={() => handleTabClick('cast')}>Cast</button>
          <div className={styles.seriesDetailsButtons}>
            <button onClick={() => router.push('/relatedShows')}>Ver más</button>
          </div>
        </div>

        {/* Sidebar */}
        {activeTab && (
            <Sidebar
                activeTab={activeTab}
                seasons={seasons}
                seasonData={seasonData}
                selectedSeason={selectedSeason}
                onSeasonClick={handleSeasonClick}
                onBackToSeasons={handleBackToSeasons}
                cast={cast}
                onClose={handleCloseSidebar}
            />
        )}

        {/* Series Similares */}
        <div className={styles.similarShows}>
          <h2>Series relacionadas</h2>
          <div className={styles.showList}>
            {similarShows.map((show) => (
                <div
                    key={show.id}
                    className={styles.showCard}
                    onClick={() => handleShowClick(show.id)} // Redirigir al hacer clic
                    style={{ cursor: "pointer" }}
                >
                  <img src={show.image?.medium || 'fallback_image_url'} alt={show.name} />
                  <h3>{show.name}</h3>
                  <p>{show.genres.join(', ')}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

