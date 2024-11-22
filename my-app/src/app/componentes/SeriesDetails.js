"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import styles from './SeriesDetails.module.css';

export default function SeriesDetails({ showDetails }) {
  const [activeTab, setActiveTab] = useState(null);
  const [seasonData, setSeasonData] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [cast, setCast] = useState([]);
  const [rating, setRating] = useState(showDetails.rating?.average || "N/A");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`https://api.tvmaze.com/shows/${showDetails.id}/images`);
        const images = await response.json();
        const background = images.find(img => img.type === 'background') || images.find(img => img.type === 'banner') || images[0];
        if (background) {
          const img = new Image();
          img.src = background.resolutions.original.url;
          img.onload = () => {
            setBackgroundImage(background.resolutions.original.url);
            setIsLoadingImage(false);
          };
        } else {
          setBackgroundImage('fallback_image_url');
          setIsLoadingImage(false);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setBackgroundImage('fallback_image_url');
        setIsLoadingImage(false);
      }
    };
    fetchImages();
  }, [showDetails.id]);

  useEffect(() => {
    if (activeTab === 'season') {
      fetchSeasons();
    } else if (activeTab === 'cast') {
      fetchCast();
    }
  }, [activeTab]);

  const fetchSeasons = async () => {
    const response = await fetch(`https://api.tvmaze.com/shows/${showDetails.id}/seasons`);
    const seasonsData = await response.json();
    setSeasons(seasonsData);
  };

  const fetchCast = async () => {
    const response = await fetch(`https://api.tvmaze.com/shows/${showDetails.id}/cast`);
    const castData = await response.json();
    setCast(castData.map(member => member.person));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedSeason(null);
    setSeasonData([]);
  };

  const handleSeasonClick = async (seasonId) => {
    const response = await fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`);
    const episodes = await response.json();
    setSeasonData(episodes);
    setSelectedSeason(seasons.find(season => season.id === seasonId));
  };

  const handleBackToSeasons = () => {
    setSelectedSeason(null);
    setSeasonData([]);
  };

  const handleCloseSidebar = () => {
    setActiveTab(null);
  };

  return (
      <div className={styles.seriesDetails}>
        {/* Fondo */}
        <div
            className={styles.background}
            style={{
              backgroundImage: isLoadingImage ? 'url("fallback_loading_image_url")' : `url(${backgroundImage})`,
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
      </div>
  );
}

