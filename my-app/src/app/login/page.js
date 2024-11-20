"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import NavBar from "../componentes/NavBar";
import './login.css';
import { Typography } from "@mui/material";

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

    const handleEmailLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            const user = userCredential.user;

            // Generar el token de sesión con Firebase
            const token = await user.getIdToken();

            // Enviar el token al servidor para configurar la cookie
            await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            console.log("Usuario autenticado y sesión creada.");
            router.push("/"); // Redirige a la página principal
        } catch (error) {
            console.error("Error en la autenticación:", error);
            setError("Credenciales incorrectas. Inténtalo de nuevo.");
        }
    };

    return (
        <>
            <NavBar />
            <div style={{ marginTop: '50px', backgroundColor:'white' }}>
                <Typography className='div'>Correo electrónico</Typography>
                <input
                    className='entrada'
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                />
                <Typography className='div'>Contraseña</Typography>
                <input
                    className='entrada'
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                />
                <button onClick={handleEmailLogin} style={{color:'black', borderColor:'black'}}>Iniciar sesión</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </>
    );
}
