"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import NavBar from "../componentes/NavBar";
import './login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleInputChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.username,
                credentials.password
            );
            const user = userCredential.user;

            const token = await user.getIdToken();
            await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            console.log("Usuario autenticado y sesión creada.");
            router.push("/");
        } catch (error) {
            console.error("Error en la autenticación:", error);
            setError("Credenciales incorrectas. Inténtalo de nuevo.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="login-container">
                <div className="login-box">
                    <h1>Iniciar Sesión</h1>
                    <label htmlFor="username">Usuario</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                        placeholder="Ingresa tu usuario"
                        className="login-input"
                    />
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder="Ingresa tu contraseña"
                        className="login-input"
                    />
                    <button onClick={handleLogin} className="login-button">
                        Iniciar sesión
                    </button>
                    {error && <p className="login-error">{error}</p>}
                    <p className="register-link">
                        ¿No tienes cuenta?{" "}
                        <a href="/registro" className="register-anchor">
                            Regístrate
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
