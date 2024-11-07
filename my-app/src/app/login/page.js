import React  from "react";
import NavBar from "../componentes/NavBar";
import './login.css';
import {Typography} from "@mui/material";

export default function login(){
    return (
        <>
        <NavBar></NavBar>
            <div >
                <Typography className='div'>Username</Typography>
                <input className={'entrada'}/>
                <Typography className='div'>Password</Typography>
                <input className={'entrada'}/>
            </div>
        </>
    );
}
