"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import styles from "./SeriesDetails.module.css";
import Link from "next/link";

export default function SeriesDetails({
  showDetails,
  isLoggedIn,
  handleToggleFavorite,
  isFavorite: initialIsFavorite,
  recommendations = [],
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(null);
  const [seasonData, setSeasonData] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [cast, setCast] = useState([]);
  const [rating, setRating] = useState(showDetails.rating?.average || "N/A");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://api.tvmaze.com/shows/${showDetails.id}/images`
        );
        const images = await response.json();
        const background =
          images.find((img) => img.type === "background") ||
          images.find((img) => img.type === "banner") ||
          images[0];
        if (background) {
          const img = new Image();
          img.src =
            background.resolutions?.original?.url ||
            background.resolutions?.medium?.url;
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

  useEffect(() => {
    if (activeTab === "season") {
      fetchSeasons();
    } else if (activeTab === "cast") {
      fetchCast();
    }
  }, [activeTab]);

  const fetchSeasons = async () => {
    try {
      const response = await fetch(
        `https://api.tvmaze.com/shows/${showDetails.id}/seasons`
      );
      const seasonsData = await response.json();
      setSeasons(seasonsData);
    } catch (error) {
      console.error("Error fetching seasons:", error);
    }
  };

  const fetchCast = async () => {
    try {
      const response = await fetch(
        `https://api.tvmaze.com/shows/${showDetails.id}/cast`
      );
      const castData = await response.json();
      setCast(castData.map((member) => member.person));
    } catch (error) {
      console.error("Error fetching cast:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedSeason(null);
    setSeasonData([]);
  };

  const handleSeasonClick = async (seasonId) => {
    try {
      const response = await fetch(
        `https://api.tvmaze.com/seasons/${seasonId}/episodes`
      );
      const episodes = await response.json();
      setSeasonData(episodes);
      setSelectedSeason(seasons.find((season) => season.id === seasonId));
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

  const handleSeeMore = () => {
    router.push(`/relatedShows?showId=${showDetails.id}`);
  };

  const filteredRecommendations = recommendations.filter(
    (serie) => serie.id !== showDetails.id
  );

  return (
    <div className={styles.seriesDetails}>
      <Link className={styles.home} href="/" passHref>
        <button>🏠︎</button>
      </Link>
      <div
        className={styles.background}
        style={{
          backgroundImage: isLoadingImage
            ? 'url("fallback_loading_image_url")'
            : `url(${backgroundImage || "fallback_image_url"})`,
        }}
      />
      <div className={styles.title}>
        <h1>{showDetails.name || "Cargando..."}</h1>
      </div>

      <div className={styles.buttons}>
        <button onClick={() => handleTabClick("season")}>Temporadas</button>
        <h2 className={styles.rating}>{rating} ☆</h2>
        <button onClick={() => handleTabClick("cast")}>Reparto</button>

        {isLoggedIn ? (
          <button
            onClick={handleToggleFavorite}
            className={styles.favoriteButton}
            aria-label="Toggle Favorite"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? "red" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.heartIcon}
            >
              <path d="M20.8 4.6c-1.7-1.8-4.5-1.8-6.2 0l-.6.7-.6-.7c-1.7-1.8-4.5-1.8-6.2 0-1.9 2-1.9 5.3 0 7.3l6.8 7.3 6.8-7.3c1.8-2 1.8-5.3 0-7.3z"></path>
            </svg>
          </button>
        ) : (
          <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>
            <p className={styles.warning}>Inicia sesión</p>
          </Link>
        )}
      </div>

      <button className={styles.vermas} onClick={handleSeeMore}>
        Ver más
      </button>

      <div className={styles.recommendations}>
        <div className={styles.recommendationList}>
          {filteredRecommendations.slice(0, 3).map((serie) => (
            <Link key={serie.id} href={`/seriesDetails/${serie.id}`} passHref>
              <div className={styles.recommendationItem}>
                <h4>{serie.name}</h4>
                <img src={serie.image?.medium} alt={serie.name} />
              </div>
            </Link>
          ))}
        </div>
      </div>

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
