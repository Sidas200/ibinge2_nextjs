"use client";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import NavBar from "../componentes/NavBar";
import './registro.css';
import {Button, Typography, Input, Snackbar, Alert} from "@mui/material";


export default function login(){
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () =>{
        if (password != confirmPassword){
            setError("Passwords do not match!");
            setOpen(true);
            return;
        }
        try {
            await addDoc(collection(db,"Usuarios"),{
                Username : username,
                Correo : correo,
                Password : password,
                Confirmacion : confirmPassword
            });
            alert("Usuario registrado exitosamente");
            setOpen(true);
            setIsSubmitted(true);
        }catch (e){
            console.error("Error adding document: ", e);
            setError("Error connecting to the database.");
            setOpen(true);
        }
    };
    useEffect(() => {
        if (isSubmitted) {

            const timer = setTimeout(() => {
                router.push('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSubmitted, router]);

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <NavBar></NavBar>
            <div style={{color:'black', marginTop:'100px'}} >
                <Typography>Crea una cuenta</Typography>
                <Typography className='div'>Username</Typography>
                <Input className={'entrada'} value={username} onChange={(e)=> setUsername(e.target.value)}/>
                <Typography className='div'>Correo electronico</Typography>
                <Input className={'entrada'} value={correo} onChange={(e)=>setCorreo(e.target.value)}/>
                <Typography className='div'>Password</Typography>
                <Input className={'entrada'} value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <Typography className='div'>Confirmar contraseña</Typography>
                <Input className={'entrada'} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                <Button onClick={handleSubmit}>Crear</Button>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={ error === "User registered succesfully" ? "success": "error"}></Alert>
                </Snackbar>
            </div>
        </>
    );
}
