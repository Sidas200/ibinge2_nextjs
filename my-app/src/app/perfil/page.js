"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Cookies from "js-cookie";
import NavBar from "../componentes/NavBar";
import { useRouter } from "next/navigation";
import "./perfil.css";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/login");
                return;
            }

            setUser({
                email: currentUser.email,
                displayName: currentUser.displayName || "Usuario sin nombre",
                uid: currentUser.uid,
            });

            fetchUserData(currentUser.uid);
        });

        return () => unsubscribe();
    }, []);

    const fetchUserData = async (userId) => {
        try {
            const q = query(collection(db, "favorites"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const favoritesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFavorites(favoritesData);
            setIsLoading(false);
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
        }
    };

    const handleDeleteFavorite = async (favoriteId) => {
        try {
            await deleteDoc(doc(db, "favorites", favoriteId));
            setFavorites((prevFavorites) =>
                prevFavorites.filter((favorite) => favorite.id !== favoriteId)
            );
        } catch (error) {
            console.error("Error al eliminar el favorito:", error);
            alert("Hubo un problema al eliminar el favorito.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Cookies.remove("authToken");
            router.push("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("Hubo un problema al cerrar sesión.");
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <h2>Cargando...</h2>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <div className="profile-container">
                <aside className="sidebar">
                    <h2 className="sidebar-title">Información del usuario</h2>
                    <p><strong>Correo:</strong> {user.email}</p>
                    <button onClick={handleLogout} className="logout-button">
                        Cerrar Sesión
                    </button>
                </aside>
                <main className="favorites-container">
                    <h2 className="favorites-title">Tus favoritos</h2>
                    <div className="favorites-grid">
                        {favorites.map((favorite) => (
                            <div key={favorite.id} className="favorite-item">
                                <img
                                    src={favorite.image || "https://via.placeholder.com/150"}
                                    alt={favorite.title}
                                    className="favorite-image"
                                />
                                <button
                                    className="favorite-delete"
                                    onClick={() => handleDeleteFavorite(favorite.id)}
                                >
                                    ❤
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}