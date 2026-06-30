"use client";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { useEffect, useState } from "react";
import { useStyles } from "tss-react/dsfr";

const LOCALSTORAGE_KEY = "disclaimerPNR_closed";

export const DisclaimerPNR = () => {
  const { css } = useStyles();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isClosed = localStorage.getItem(LOCALSTORAGE_KEY);
    if (isClosed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(LOCALSTORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Notice
      className={css({
        backgroundColor: 'var(--gris-medium)',
        borderRadius: '1rem',
        color: '#201F1E',
        margin: '2rem 3rem',
        marginTop: '2rem',
        '& .fr-container': {
          maxWidth: 'none'
        }
      })}
      isClosable={true} 
      onClose={handleClose} 
      title={'Attention :'}
      description={
        <>
          En raison de l’indisponibilité du site de l’INPN, la liste des communes classées PNR nous a été
          fournie par la Fédération des Parcs naturels régionaux de France, puis actualisée avec les
          fusions de communes 2025 (source INSEE, géographie au 01/01/2025)
        </>
      }
    />
  )
}
