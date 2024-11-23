"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase"; // Asegúrate de importar correctamente Firebase
import { collection, query, where, getDocs } from "firebase/firestore";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert("Debes iniciar sesión.");
                return;
            }

            setUser({
                email: currentUser.email,
                displayName: currentUser.displayName || "Usuario sin nombre",
            });

            // Obtener favoritos del usuario
            const q = query(
                collection(db, "favorites"),
                where("userId", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);

            const favoritesData = querySnapshot.docs.map((doc) => doc.data());
            setFavorites(favoritesData);
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2>Cargando...</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Perfil del Usuario</h1>
            {user && (
                <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid lightgray", borderRadius: "8px" }}>
                    <h2>Datos del Usuario</h2>
                    <p><strong>Nombre:</strong> {user.displayName}</p>
                    <p><strong>Correo:</strong> {user.email}</p>
                </div>
            )}

            <h2>Favoritos</h2>
            {favorites.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {favorites.map((favorite, index) => (
                        <li
                            key={index}
                            style={{
                                border: "1px solid lightgray",
                                borderRadius: "8px",
                                padding: "10px",
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <img
                                src={favorite.image || "https://via.placeholder.com/100"}
                                alt={favorite.title}
                                style={{ width: "100px", height: "100px", borderRadius: "8px", marginRight: "10px" }}
                            />
                            <div>
                                <h3>{favorite.title}</h3>
                                <p><strong>Géneros:</strong> {Array.isArray(favorite.genres) ? favorite.genres.join(", ") : "N/A"}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes favoritos guardados.</p>
            )}
        </div>
    );
}

