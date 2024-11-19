// src/app/series/[id]/page.js
"use client";
import SeriesDetails from '../../componentes/SeriesDetails';
import { fetchShowDetails, fetchCast } from '../../lib/mazeApi';

async function SeriesPage({ params }) {
  const { id } = params;

  // Fetch show details and cast data
  const showDetails = await fetchShowDetails(id);
  const castDetails = await fetchCast(id);

  return (
    <div>
      <SeriesDetails showDetails={showDetails} castDetails={castDetails} />
    </div>
  );
}

export default SeriesPage;
