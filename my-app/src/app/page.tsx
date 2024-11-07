
import React from 'react';
import NavBar from "@/app/componentes/NavBar";
import SearchBar from "@/app/componentes/SearchBar";
import MovieCarrusel from "@/app/componentes/MovieCarrusel";
import Image from 'next/image';

export default function HomePage() {
    const handleSearch = (query: string) => {
        console.log(`Search query: ${query}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center text-white">
            {/* Fondo y Encabezado */}
            <header className="ibinge w-full flex items-center justify-center">
                <h1 className="text-5xl font-bold">iBinge</h1>
            </header>

            {/* Barra de Navegación */}
            <div className="navbar w-full flex justify-between items-center px-10 py-4 bg-gray-100 shadow-md">
                <SearchBar className="search-bar" onSearch={handleSearch} />
                <div className="ml-4">
                    <Image src="/icons/lupa.png" alt="Icono de Búsqueda" width={24} height={24} />
                </div>
                <NavBar onSearch={handleSearch} />
            </div>

            {/* Sección de Carrusel de Series */}
            <section className="carousel-section w-full py-10 bg-gray-700">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Series Populares</h2>
                    <MovieCarrusel showIds={[1, 2, 3]} /> {/* Ajusta los IDs de showIds según tu API */}
                </div>
            </section>

            {/* Botón de Shuffle */}
            <div className="flex justify-end w-full px-10 py-2">
                <button className="shuffle-button">
                    <Image src="/icons/shuffle.png" alt="Shuffle" width={24} height={24} />
                </button>
            </div>

            {/* Sección de Plataformas de Streaming */}
            <section className="w-full bg-black py-10 streaming-logos">
                <h3 className="text-lg font-semibold mb-4 text-center">Selecciona tu Plataforma</h3>
                <div className="grid grid-cols-4 gap-4 justify-items-center">
                    {/* Aquí puedes colocar comentarios para las imágenes de las plataformas */}
                    {/*
                    <Image src="/icons/netflix.png" alt="Netflix" width={50} height={50} />
                    <Image src="/icons/hulu.png" alt="Hulu" width={50} height={50} />
                    <Image src="/icons/disney.png" alt="Disney+" width={50} height={50} />
                    <Image src="/icons/prime-video.png" alt="Prime Video" width={50} height={50} />
                    <Image src="/icons/paramount.png" alt="Paramount+" width={50} height={50} />
                    <Image src="/icons/max.png" alt="Max" width={50} height={50} />
                    <Image src="/icons/apple-tv.png" alt="Apple TV" width={50} height={50} />
                    <Image src="/icons/crunchyroll.png" alt="Crunchyroll" width={50} height={50} />
                    */}
                </div>
            </section>
        </div>
    );
}

