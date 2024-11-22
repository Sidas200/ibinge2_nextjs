// src/app/series/[id]/page.js
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import SeriesDetails from "../../componentes/SeriesDetails";
import { fetchShowDetails, fetchCast } from "../../lib/mazeApi";
import ima from "../../images/25694.png"; // Asegúrate de que la ruta sea correcta

function SeriesPage({ params }) {
    const { id } = params;

    const [showDetails, setShowDetails] = useState(null);
    const [castDetails, setCastDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data
                const showData = await fetchShowDetails(id);
                const castData = await fetchCast(id);

                // Simula la precarga de una imagen
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

        fetchData();
    }, [id]);

    if (isLoading) {
        // Pantalla de carga
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2>Cargando...</h2>
            </div>
        );
    }

    return (
        <>
            {/* Botón con imagen para regresar al inicio */}
            <Link href="/" passHref>
                <button style={{ borderRadius: "20px", background: "lightgray", cursor: "pointer" }}>
                    <img
                        src={ima.src} // Next.js maneja imágenes importadas con src
                        alt="Regresar al inicio"
                        style={{ width: "50px", height: "50px" }} // Ajusta tamaño según sea necesario
                    />
                </button>
            </Link>

            <div>
                {showDetails && castDetails ? (
                    <SeriesDetails showDetails={showDetails} castDetails={castDetails} />
                ) : (
                    <h2>No se pudieron cargar los detalles de la serie.</h2>
                )}
            </div>
        </>
    );
}

export default SeriesPage;


