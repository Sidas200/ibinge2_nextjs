"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase"; // Asegúrate de importar correctamente Firebase
import { doc, setDoc } from "firebase/firestore"; // Para guardar datos en Firestore
import Cookies from "js-cookie";
import SeriesDetails from "../../componentes/SeriesDetails";
import { fetchShowDetails, fetchCast } from "../../lib/mazeApi";
import ima from "../../images/25694.png"; // Asegúrate de que la ruta sea correcta

function SeriesPage({ params }) {
    const { id } = params;

    const [showDetails, setShowDetails] = useState(null);
    const [castDetails, setCastDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDelayedLoading, setIsDelayedLoading] = useState(true); // Nuevo estado para retraso en la carga
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

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

        // Retrasar el fin de la pantalla de carga
        const timeout = setTimeout(() => setIsDelayedLoading(false), 3000); // 2 segundos
        return () => clearTimeout(timeout);
    }, [id]);

    const handleAddToFavorites = async () => {
        try {
            const user = auth.currentUser; // Obtener usuario actual de Firebase Auth
            if (!user) {
                router.push("/login");
                return;
            }

            const favoriteData = {
                userId: user.uid,
                showId: id,
                title: showDetails.name,
                image: showDetails.image?.original || null,
                genres: showDetails.genres || [], // Guardar los géneros de la serie
                timestamp: new Date(),
            };

            // Guardar en Firebase
            await setDoc(doc(db, "favorites", `${user.uid}_${id}`), favoriteData);

            alert("Serie añadida a favoritos.");
        } catch (error) {
            console.error("Error añadiendo a favoritos:", error);
            alert("Hubo un problema al añadir a favoritos.");
        }
    };

    // Pantalla de carga negra con círculo
    if (isLoading || isDelayedLoading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "black",
                color: "white"
            }}>
                <div style={{
                    width: "50px",
                    height: "50px",
                    border: "5px solid white",
                    borderTop: "5px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
                <style jsx>{`
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            <Link href="/" passHref>
                <button style={{ borderRadius: "20px", background: "lightgray", cursor: "pointer" }}>
                    <img
                        src={ima.src}
                        alt="Regresar al inicio"
                        style={{ width: "50px", height: "50px" }}
                    />
                </button>
            </Link>

            <div>
                {showDetails && castDetails ? (
                    <>
                        <SeriesDetails showDetails={showDetails} castDetails={castDetails} />
                        {isLoggedIn && (
                            <button
                                onClick={handleAddToFavorites}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#ff9800",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginTop: "20px",
                                }}
                            >
                                Añadir a Favoritos
                            </button>
                        )}
                        {!isLoggedIn && (
                            <p style={{ marginTop: "20px", color: "red" }}>
                                Debes iniciar sesión para añadir a favoritos.
                            </p>
                        )}
                    </>
                ) : (
                    <h2>No se pudieron cargar los detalles de la serie.</h2>
                )}
            </div>
        </>
    );
}

export default SeriesPage;



