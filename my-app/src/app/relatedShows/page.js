"use client";

import React from "react";
import RelatedShows from "../componentes/relatedShows";

export default function Page({ showDetails }) {
  return (
    <div>
      <h1>Series Relacionadas</h1>
      <RelatedShows showDetails={showDetails} />
    </div>
  );
}
