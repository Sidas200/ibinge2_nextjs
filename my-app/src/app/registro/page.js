"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import NavBar from "../componentes/NavBar";
import './registro.css';
import { Button, Typography, Input, Snackbar, Alert } from "@mui/material";

export default function Register() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const { push } = useRouter();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [open, setOpen] = useState(false);
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
            setOpen(true);
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            await addDoc(collection(db, "Usuarios"), {
                Correo: credentials.email,
                Password: credentials.password,
            });
            setError("Usuario registrado exitosamente");
            setOpen(true);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error al registrar usuario: ", error);
            setError("Error al registrar usuario. Inténtalo de nuevo.");
            setOpen(true);
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

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <NavBar />
            <div style={{ color: 'white', backgroundColor: 'white', marginTop: '100px', padding: '20px', borderRadius: '8px' }}>
                <Typography variant="h5" style={{ color: 'black' }}>Crea una cuenta</Typography>
                <Typography className='div' style={{ color: 'black' }}>Correo electrónico</Typography>
                <Input
                    className='entrada'
                    name="email"
                    value={credentials.email}
                    onChange={changeUser}
                    style={{ color: 'black', backgroundColor: 'white', border: '1px solid black' }}
                />
                <Typography className='div' style={{ color: 'black' }}>Contraseña</Typography>
                <Input
                    className='entrada'
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={changeUser}
                    style={{ color: 'black', backgroundColor: 'white', border: '1px solid black' }}
                />
                <Typography className='div' style={{ color: 'black' }}>Confirmar contraseña</Typography>
                <Input
                    className='entrada'
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ color: 'black', backgroundColor: 'white', border: '1px solid black' }}
                />
                <Button onClick={registerUser} variant="contained" style={{ color: 'black', backgroundColor: 'white', marginTop: '10px', border: '1px solid black' }}>Crear</Button>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={error === "Usuario registrado exitosamente" ? "success" : "error"} style={{ color: 'black', backgroundColor: 'white' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}

