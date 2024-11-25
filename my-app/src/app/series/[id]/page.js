"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import SeriesDetails from "../../componentes/SeriesDetails";
import { fetchShowDetails, fetchCast } from "../../lib/mazeApi";

function SeriesPage({ params }) {
    const { id } = params;
    const router = useRouter();

    const [showDetails, setShowDetails] = useState(null);
    const [castDetails, setCastDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookies.get("authToken");
            setIsLoggedIn(!!token);
        };

        const fetchData = async () => {
            try {
                const showData = await fetchShowDetails(id);
                const castData = await fetchCast(id);

                if (showData.image?.original) {
                    const img = new Image();
                    img.src = showData.image.original;
                    img.onload = () => setIsLoading(false);
                } else {
                    setIsLoading(false);
                }

                setShowDetails(showData);
                setCastDetails(castData);

                const user = auth.currentUser;
                if (user) {
                    const favoriteRef = doc(db, "favorites", `${user.uid}_${id}`);
                    const favoriteDoc = await getDoc(favoriteRef);
                    setIsFavorite(favoriteDoc.exists());
                }
            } catch (error) {
                console.error("Error fetching series data:", error);
                setIsLoading(false);
            }
        };

        checkAuth();
        fetchData();
    }, [id]);

    const handleToggleFavorite = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                router.push("/login");
                return;
            }

            const favoriteRef = doc(db, "favorites", `${user.uid}_${id}`);
            if (isFavorite) {
                await deleteDoc(favoriteRef);
                setIsFavorite(false);
            } else {
                const favoriteData = {
                    userId: user.uid,
                    showId: id,
                    title: showDetails.name,
                    image: showDetails.image?.original || null,
                    genres: showDetails.genres || [],
                    timestamp: new Date(),
                };

                await setDoc(favoriteRef, favoriteData);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error manejando favoritos:", error);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2>Cargando...</h2>
            </div>
        );
    }

    return (
        <>
            <div>
                {showDetails && castDetails ? (
                    <SeriesDetails
                        showDetails={showDetails}
                        castDetails={castDetails}
                        isLoggedIn={isLoggedIn}
                        handleToggleFavorite={handleToggleFavorite}
                        isFavorite={isFavorite}
                    />
                ) : (
                    <h2>No se pudieron cargar los detalles de la serie.</h2>
                )}
            </div>
        </>
    );
}

export default SeriesPage;
