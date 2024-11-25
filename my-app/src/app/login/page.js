"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import { auth } from "../../firebase";
import NavBar from "../componentes/NavBar";
import './login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
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
            const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            const user = userCredential.user;

            const token = await user.getIdToken();

            Cookies.set("authToken", token, { expires: 7 });

            await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            router.push("/");
        } catch (error) {
            setError("Credenciales incorrectas. Inténtalo de nuevo.");
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="form-card">
                    <h1>Iniciar sesión</h1>
                    <p className="subtext">
                        ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
                    </p>
                    <form className="login-form">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu correo"
                            required
                        />
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                        <button type="button" onClick={handleLogin}>
                            Iniciar sesión
                        </button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
                <div className="image-section">
                </div>
            </div>
        </>
    );
}
