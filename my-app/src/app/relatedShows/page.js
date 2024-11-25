"use client";

import React from "react";
import RelatedShows from "../componentes/relatedShows";
import styles from "../componentes/RelatedShows.module.css";

export default function Page({ showDetails }) {
  return (
    <div className={styles.everything}>
      <div className={styles.rsback}>
      </div>
      <RelatedShows showDetails={showDetails} />
    </div>
  );
}
