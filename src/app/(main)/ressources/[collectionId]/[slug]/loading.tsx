"use client";

import { LoaderText } from "@/components/ui/loader";
import { useEffect } from "react";

const Loading = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    // 100dvh (au lieu de 80dvh par défaut) : le pied de page reste sous la
    // ligne de flottaison et ne saute pas à l'arrivée de l'article.
    <LoaderText text="Chargement de l'article" height="100dvh" />
  )
}

export default Loading;
