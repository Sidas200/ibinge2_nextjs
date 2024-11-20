// src/app/series/[id]/page.js
import Link from "next/link";
import SeriesDetails from "../../componentes/SeriesDetails";
import { fetchShowDetails, fetchCast } from "../../lib/mazeApi";
import ima from "../../images/25694.png"; // Asegúrate de que la ruta sea correcta

async function SeriesPage({ params }) {
  const { id } = params;

  // Fetch show details and cast data
  const showDetails = await fetchShowDetails(id);
  const castDetails = await fetchCast(id);

  return (
      <>
        {/* Botón con imagen para regresar al inicio */}
        <Link href="/" passHref>
          <button style={{ borderRadius:"20px", background: "lightgray", cursor: "pointer" }}>
            <img
                src={ima.src} // Next.js maneja imágenes importadas con src
                alt="Regresar al inicio"
                style={{ width: "50px", height: "50px" }} // Ajusta tamaño según sea necesario
            />
          </button>
        </Link>

        <div>
          <SeriesDetails showDetails={showDetails} castDetails={castDetails} />
        </div>
      </>
  );
}

export default SeriesPage;

