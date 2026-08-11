"use client";
import CubeIcon from '@/assets/icons/cube.svg';
import WaterDropIcon from "@/assets/icons/water_drop_blue.svg";
import { Body } from "@/design-system/base/Textes";
import couleurs from "@/design-system/couleurs";
import { CommunesContoursDto, CommunesIndicateursDto } from '@/lib/dto';
import { MapContainer } from '@/lib/react-leaflet';
import { Round } from "@/lib/utils/reusableFunctions/round";
import * as turf from '@turf/turf';
import { Progress } from "antd";
import {
  Feature,
  GeoJsonObject,
  GeoJsonProperties,
  MultiPolygon,
  Polygon
} from 'geojson';
// Leaflet must not be imported at module scope because it accesses `window`.
// We load it lazily in hooks where needed.
import { GeoJSON } from '@/lib/react-leaflet';
import 'leaflet/dist/leaflet.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from 'react';
import { BoundsFromCollection } from "../maps/subcomponents/boundsFromCollection";
import styles from "./charts.module.scss";

type MicroPieChartTypes = {
  strokeLinecap: 'butt';
  type: 'circle';
  size: number;
  strokeWidth: number;
  showInfo: boolean;
};

const ProgressProps: MicroPieChartTypes = {
  strokeLinecap: 'butt',
  type: 'circle',
  size: 110,
  strokeWidth: 18,
  showInfo: false
};

const NumberCircleProps: MicroPieChartTypes = {
  strokeLinecap: 'butt',
  type: 'circle',
  size: 110,
  strokeWidth: 10,
  showInfo: false
};

export const MicroPieChart = ({
  pourcentage,
  arrondi = 0,
  ariaLabel = ""
}: {
  pourcentage: number | string;
  arrondi?: number;
  ariaLabel?: string;
}) => {
  return (
    <>
      {
        isNaN(Number(pourcentage)) ? null : (
          <div className={styles.microPieChartWrapper}>
            <Progress
              {...ProgressProps}
              aria-label={ariaLabel}
              percent={Number(pourcentage)}
              strokeColor={couleurs.gris.dark}
              trailColor={couleurs.gris.medium}
            />
            <div className={styles.microChartText}>
              <Body style={{ color: couleurs.gris.dark }} weight="bold">
                {Round(Number(pourcentage), arrondi)} %
              </Body>
            </div>
          </div>
        )
      }
    </>
  );
}

export const MicroNumberCircle = ({
  valeur,
  arrondi = 0,
  ariaLabel = "",
  unite = '',
  size = 'md',
  comparateur = ""
}: {
  valeur: number | string;
  arrondi?: number;
  ariaLabel?: string;
  unite?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  comparateur?: '>' | '<' | '>=' | '<=' | '=' | '+' | '-' | '';
}) => {
  const displayValue = Round(Number(valeur), arrondi);
  const displayString = `${comparateur}${displayValue} ${unite}`.trim();
  const shouldBreak = displayString.length > 8;
  return (
    <>
      {
        isNaN(Number(valeur)) ? null : (
          <div className={styles.microNumberCircleWrapper}>
            <Progress
              {...NumberCircleProps}
              aria-label={ariaLabel}
              percent={100}
              strokeColor={couleurs.gris.dark}
              trailColor={couleurs.gris.medium}
            />
            <div className={styles.microChartText}>
              <Body style={{ color: couleurs.gris.dark }} weight="bold" size={size}>
                {shouldBreak ? <>{comparateur}{displayValue}<br />{unite}</> : <>{comparateur}{displayValue} {unite}</>}
              </Body>
            </div>
          </div>
        )
      }
    </>
  );
}

export const MicroNumberCircleWithText = ({
  valeur,
  arrondi = 0,
  ariaLabel = "",
  unite = '',
  size = 'md',
  comparateur = "",
  texte = ""
}: {
  valeur: number | string;
  arrondi?: number;
  ariaLabel?: string;
  unite?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  comparateur?: '>' | '<' | '>=' | '<=' | '=' | '+' | '-' | '';
  texte?: string;
}) => {
  const displayValue = Round(Number(valeur), arrondi);
  return (
    <>
      {
        isNaN(Number(valeur)) ? null : (
          <div className={styles.microNumberCircleWrapper}>
            <Progress
              {...NumberCircleProps}
              aria-label={ariaLabel}
              percent={100}
              strokeColor={couleurs.gris.dark}
              trailColor={couleurs.gris.medium}
            />
            <div className={styles.microChartText}>
              <Body style={{ color: couleurs.gris.dark }} weight="bold" size={size}>
                {<>{comparateur}{displayValue} {unite}</>}{texte && <><br />{texte}</>}
              </Body>
            </div>
          </div>
        )
      }
    </>
  );
}

export const MicroCircleGrid = ({
  pourcentage,
  arrondi = 0,
  ariaLabel = ""
}: {
  pourcentage: number;
  arrondi?: number;
  ariaLabel?: string;
}) => {
  const cerclesComplets = Math.floor(pourcentage / 5);
  const reste = pourcentage % 5;
  const aDemiCercle = reste >= 2.5;

  const cercles = Array.from({ length: 20 }, (_, index) => {
    let etatCercle: 'vide' | 'demi' | 'complet' = 'vide';
    if (index < cerclesComplets) {
      etatCercle = 'complet';
    } else if (index === cerclesComplets && aDemiCercle) {
      etatCercle = 'demi';
    }
    let backgroundStyle: string;
    if (etatCercle === 'complet') {
      backgroundStyle = couleurs.gris.dark;
    } else if (etatCercle === 'demi') {
      backgroundStyle = `linear-gradient(90deg, ${couleurs.gris.dark} 50%, ${couleurs.gris.light} 50%)`;
    } else {
      backgroundStyle = couleurs.gris.light;
    }
    return (
      <div
        key={index}
        className={styles.cercleIndividuel}
        style={{
          background: backgroundStyle,
        }}
      />
    );
  });

  return (
    <>
      {
        isNaN(Number(pourcentage)) ? null : (
          <div
            className={styles.microCircleGridWrapper}
            role="img"
            aria-label={ariaLabel}
          >
            <Body weight="bold">{Round(pourcentage, arrondi)} %</Body>
            <div className={styles.circleGrid}>
              {cercles}
            </div>
          </div>
        )}
    </>
  );
}

export const MicroCircleGridMois = ({
  nombreJours,
  arrondi = 0,
  ariaLabel = ""
}: {
  nombreJours: number;
  arrondi?: number;
  ariaLabel?: string;
}) => {
  const cerclesComplets = Math.floor(nombreJours);
  const reste = nombreJours % 1;
  const aDemiCercle = reste >= 0.5;

  const cercles = Array.from({ length: 30 }, (_, index) => {
    let etatCercle: 'vide' | 'demi' | 'complet' = 'vide';
    if (index < cerclesComplets) {
      etatCercle = 'complet';
    } else if (index === cerclesComplets && aDemiCercle) {
      etatCercle = 'demi';
    }
    let backgroundStyle: string;
    if (etatCercle === 'complet') {
      backgroundStyle = couleurs.gris.dark;
    } else if (etatCercle === 'demi') {
      backgroundStyle = `linear-gradient(90deg, ${couleurs.gris.dark} 50%, ${couleurs.gris.light} 50%)`;
    } else {
      backgroundStyle = couleurs.gris.light;
    }
    return (
      <div
        key={index}
        className={styles.cercleIndividuel}
        style={{
          background: backgroundStyle,
        }}
      />
    );
  });

  return (
    <>
      {
        isNaN(Number(nombreJours)) ? null : (
          <div
            className={styles.microCircleGridWrapper}
            role="img"
            aria-label={ariaLabel}
            style={{ width: "120px" }}
          >
            <Body weight="bold">{Round(nombreJours, arrondi)} jours / mois</Body>
            <div className={styles.circleGrid}>
              {cercles}
            </div>
          </div>
        )}
    </>
  );
}

export const MicroCube = ({
  valeur,
  arrondi = 0,
  unite = "",
  ariaLabel = ""
}: {
  valeur: number;
  arrondi?: number;
  unite?: string;
  ariaLabel?: string;
}) => {

  return (
    <>
      {
        isNaN(Number(valeur)) ? null : (
          <div
            className={styles.microCubeWrapper}
            aria-label={ariaLabel}
          >
            <Body weight="bold">{Round(valeur, arrondi)} {unite}</Body>
            <Image
              src={CubeIcon}
              alt=""
              width={80}
              height={80}
            />
          </div>
        )}
    </>
  );
}

export const MicroRemplissageTerritoire = (props: {
  territoireContours: CommunesContoursDto[];
  pourcentage: number;
  height?: number;
  arrondi?: number;
  ariaLabel?: string;
}) => {
  const { territoireContours, pourcentage, arrondi = 0, height = 150, ariaLabel = "" } = props;
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [bounds, setBounds] = useState<number[]>([0, 0, 0, 0]);
  const south = bounds[1];
  const north = bounds[3];
  const west = bounds[0];
  const east = bounds[2];
  const hauteurTerritoire = north - south;
  const largeurTerritoire = east - west;
  // Amélioration du calcul des dimensions
  const aspectRatio = largeurTerritoire / hauteurTerritoire;

  // Calcul plus précis pour que le territoire remplisse vraiment l'espace
  let containerWidth: number;
  let containerHeight: number;

  // On force toujours la hauteur à être celle demandée
  containerHeight = height;

  if (aspectRatio > 1) {
    // Territoire plus large que haut - on calcule la largeur proportionnellement
    containerWidth = containerHeight * aspectRatio * 0.6;
  } else {
    // Territoire plus haut que large - on utilise un ratio ajusté
    containerWidth = Math.max(containerHeight * aspectRatio * 0.6, 80); // Largeur min de 80px
  }

  // Assurer des dimensions minimales
  containerWidth = Math.max(50, containerWidth);
  containerHeight = Math.max(50, containerHeight);

  const newValue = south + (hauteurTerritoire * pourcentage) / 100;
  const polygon = turf.polygon([
    [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[1]],
      [bounds[2], newValue],
      [bounds[0], newValue],
      [bounds[0], bounds[1]]
    ]
  ]);
  const geojsonObject = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const L = require('leaflet');
    return L.geoJSON(territoireContours as unknown as GeoJsonObject);
  }, [territoireContours]);

  useEffect(() => {
    if (territoireContours.length === 0 || !geojsonObject) return;
    setBounds(geojsonObject.getBounds().toBBoxString().split(',').map(Number));
  }, [territoireContours, geojsonObject]);

  const union =
    territoireContours.length > 1
      ? turf.union(
        turf.featureCollection(
          territoireContours as Feature<
            Polygon | MultiPolygon,
            GeoJsonProperties
          >[]
        )
      )
      : territoireContours[0];

  const intersect = union
    ? turf.intersect(
      turf.featureCollection([
        polygon,
        union as Feature<Polygon, GeoJsonProperties>
      ])
    )
    : null;

  return (
    isNaN(pourcentage) ? null : (
      <div
        className='flex flex-column items-center'
        style={{ flexDirection: 'column' }}
        role='img'
        aria-label={ariaLabel ? `${Round(pourcentage, arrondi)} % — ${ariaLabel}` : undefined}
      >
        <Body weight="bold" style={{ color: couleurs.gris.dark, position: "absolute" }}>
          {Round(pourcentage, arrondi)} %
        </Body>
        {territoireContours.length > 0 && bounds[0] !== 0 ? (
          <div style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            paddingTop: '1.5rem'
          }}>
            <MapContainer
              ref={mapRef}
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
              }}
              attributionControl={false}
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
              bounds={[
                [bounds[1], bounds[0]],
                [bounds[3], bounds[2]]
              ]}
              boundsOptions={{
                padding: [0, 0],
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  zIndex: '501',
                  margin: 'auto',
                  position: 'relative',
                  width: 'fit-content',
                }}
              />
              <GeoJSON
                data={union as unknown as GeoJsonObject}
                style={{
                  color: 'var(--gris-dark)',
                  weight: 1,
                  fillColor: couleurs.gris.light,
                  fillOpacity: 1,
                  opacity: 1,
                }}
              />
              <GeoJSON
                data={intersect as unknown as GeoJsonObject}
                style={{
                  color: 'none',
                  fillColor: couleurs.gris.dark,
                  opacity: 1,
                  fillOpacity: 1,
                }}
              />
            </MapContainer>
          </div>
        ) : (
          ""
        )}
      </div>
    )

  );
};

export const MicroChiffreTerritoire = (props: {
  territoireContours: CommunesContoursDto[];
  value: number;
  unit: string;
  height?: number;
  arrondi?: number;
}) => {
  const { territoireContours, value, unit, height = 120, arrondi = 0 } = props;
  const mapRef = useRef<L.Map | null>(null);
  const [bounds, setBounds] = useState<number[]>([0, 0, 0, 0]);
  const south = bounds[1];
  const north = bounds[3];
  const west = bounds[0];
  const east = bounds[2];
  const hauteurTerritoire = north - south;
  const largeurTerritoire = east - west;

  // Amélioration du calcul des dimensions
  const aspectRatio = largeurTerritoire / hauteurTerritoire;

  // Calcul plus précis pour que le territoire remplisse vraiment l'espace
  let containerWidth: number;
  let containerHeight: number;

  // On force toujours la hauteur à être celle demandée
  containerHeight = height;

  if (aspectRatio > 1) {
    // Territoire plus large que haut - on calcule la largeur proportionnellement
    containerWidth = containerHeight * aspectRatio * 0.8;
  } else {
    // Territoire plus haut que large - on utilise un ratio ajusté
    containerWidth = Math.max(containerHeight * aspectRatio * 0.8, 80); // Largeur min de 80px
  }

  // Assurer des dimensions minimales
  containerWidth = Math.max(50, containerWidth);
  containerHeight = Math.max(50, containerHeight);

  const geojsonObject = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const L = require('leaflet');
    return L.geoJSON(territoireContours as unknown as GeoJsonObject);
  }, [territoireContours]);

  useEffect(() => {
    if (territoireContours.length === 0 || !geojsonObject) return;
    setBounds(geojsonObject.getBounds().toBBoxString().split(',').map(Number));
  }, [territoireContours, geojsonObject]);
  const union =
    territoireContours.length > 1
      ? turf.union(
        turf.featureCollection(
          territoireContours as Feature<
            Polygon | MultiPolygon,
            GeoJsonProperties
          >[]
        )
      )
      : territoireContours[0];

  return (
    <>
      {territoireContours.length > 0 && bounds[0] != 0 ? (
        <div style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <MapContainer
            ref={mapRef}
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'transparent',
            }}
            attributionControl={false}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            bounds={[
              [bounds[1], bounds[0]],
              [bounds[3], bounds[2]]
            ]}
            boundsOptions={{
              padding: [0, 0],
            }}
          >
            <div
              style={{
                display: 'flex',
                alignSelf: 'center',
                zIndex: '501',
                margin: 'auto',
                backgroundColor: 'white',
                padding: '0.1rem 0.3rem',
                borderRadius: '0.5rem',
                position: 'relative',
                marginTop: `${containerHeight / 2.4}px`,
                boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                width: 'fit-content',
              }}
            >
              <Body>
                {Round(value, arrondi)} {unit}
              </Body>
            </div>
            <GeoJSON
              data={union as unknown as GeoJsonObject}
              style={{
                color: 'transparent',
                weight: 1,
                fillColor: couleurs.gris.dark,
                fillOpacity: 1,
                opacity: 1
              }}
            />
          </MapContainer>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const MicroRemplissageTerritoireMapLibre = (props: {
  territoireContours: CommunesIndicateursDto[];
  pourcentage: number;
  height?: number;
  arrondi?: number;
}) => {
  const { territoireContours } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const enveloppe = BoundsFromCollection(territoireContours, type, code);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // GeoJSON
  const geoJsonData = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: territoireContours.map(commune => ({
        ...commune,
        id: commune.properties.code_geographique
      }))
    };
  }, [territoireContours]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('load', () => {
      // Fit bounds
      if (
        enveloppe &&
        Array.isArray(enveloppe) &&
        enveloppe.length > 1 &&
        Array.isArray(enveloppe[0]) &&
        enveloppe[0].length === 2
      ) {
        const lons = enveloppe.map((coord: number[]) => coord[1]);
        const lats = enveloppe.map((coord: number[]) => coord[0]);
        const minLng = Math.min(...lons);
        const maxLng = Math.max(...lons);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        map.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]],
          { padding: 20 },
        );
      }

      // Add source
      map.addSource('inconfort-thermique-communes', {
        type: 'geojson',
        data: geoJsonData as unknown as "FeatureCollection",
        generateId: false
      });


    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geoJsonData, enveloppe]);

  return (

    <div style={{ position: 'relative' }}>
      <div ref={mapContainer} style={{ height: '200px', width: '100%' }} />
    </div>
  );
};

export const WaterDropNumber = ({
  value,
  arrondi = 0,
}: {
  value: number;
  arrondi?: number;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{
        position: "relative",
        width: 110,
        height: 120,
        display: "flex",
      }}>
        <Image
          src={WaterDropIcon}
          alt=""
          width={100}
          height={120}
        />
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "5%",
            display: 'flex',
            alignSelf: 'center',
            flexDirection: "column",
            padding: '0.1rem 0.3rem',
            borderRadius: '0.5rem',
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
            width: 'fit-content',
            border: '1px solid var(--gris-dark)',
          }}
        >
          <Body>
            {Round(value, arrondi)} Mm³
          </Body>
        </div>
      </div>
    </div>
  );
};

