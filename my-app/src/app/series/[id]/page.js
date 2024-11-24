"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
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

    // Comprobar si el usuario está autenticado
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
            } catch (error) {
                console.error("Error fetching series data:", error);
                setIsLoading(false);
            }
        };

        checkAuth();
        fetchData();
    }, [id]);

    const handleAddToFavorites = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                router.push("/login");
                return;
            }

            const favoriteData = {
                userId: user.uid,
                showId: id,
                title: showDetails.name,
                image: showDetails.image?.original || null,
                genres: showDetails.genres || [],
                timestamp: new Date(),
            };

            await setDoc(doc(db, "favorites", `${user.uid}_${id}`), favoriteData);
        } catch (error) {
            console.error("Error añadiendo a favoritos:", error);
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
                        handleAddToFavorites={handleAddToFavorites}
                    />
                ) : (
                    <h2>No se pudieron cargar los detalles de la serie.</h2>
                )}
            </div>
        </>
    );
}

export default SeriesPage;