"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import NavBar from "../componentes/NavBar";
import './registro.css';

export default function Register() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const { push } = useRouter();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const changeUser = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const registerUser = async () => {
        if (credentials.password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            await addDoc(collection(db, "Usuarios"), {
                Correo: credentials.email,
                Password: credentials.password,
            });
            setError("Usuario registrado exitosamente");
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error al registrar usuario: ", error);
            setError("Error al registrar usuario. Inténtalo de nuevo.");
        }
    };

    useEffect(() => {
        if (isSubmitted) {
            const timer = setTimeout(() => {
                push("/login");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSubmitted, push]);

    return (
        <>
            <NavBar />
            <div className="registro-container">
                <div className="form-card">
                    <h1>Crea una cuenta</h1>
                    <p className="subtext">
                        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
                    </p>
                    <form className="registro-form">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={changeUser}
                            placeholder="Ingresa tu correo"
                            required
                        />
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={changeUser}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                        <label htmlFor="confirm-password">Confirmar contraseña</label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu contraseña"
                            required
                        />
                        <button type="button" onClick={registerUser}>
                            Registrarse
                        </button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
                <div className="image-section">
                    <div className="text-overlay">
                        Tilines Belicos<br /> Pitt was here.
                    </div>
                </div>
            </div>
        </>
    );
}
