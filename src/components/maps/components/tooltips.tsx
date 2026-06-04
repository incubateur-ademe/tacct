import { Round } from "@/lib/utils/reusableFunctions/round";
import { Sum } from "@/lib/utils/reusableFunctions/sum";

export const CoursDeauTooltip = (coursDeau: string, color: string) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; padding: 0.5rem; gap: 0.5rem; align-items: center; width: max-content;">
      <div
      style="background-color: ${color}; width: 1rem; height: 1rem; border-radius: 2px; border: 0.5px solid #161616"
      ></div>
      <p style="font-size: 0.875; font-family: Marianne; font-weight: 400; margin: 0">${coursDeau.charAt(0).toUpperCase() + coursDeau.slice(1)}</p> 
    </div>
  `;
};

export const AOT40Tooltip = (sitesInCluster: string[]) => {
  const displayedSites = sitesInCluster.slice(0, 10);
  return `
    <div style="padding: 0.25rem;">
      <div style="font-size: 0.75rem; font-family: Marianne; font-weight: 400; border-bottom: 1px solid #B8B8B8; margin-bottom: 0.5rem;">
        Dans ce regroupement :
      </div>
      <div style="display: flex; flex-direction: column; font-size: 10px; font-family: Marianne; font-weight: 700;">
        ${displayedSites.map((site) => `<div>${site}</div>`).join('')}
        ${sitesInCluster.length > 10 ? '<div>...</div>' : ''}
      </div>
    </div>`;
};

export const CatnatTooltip = (restCatnat: object, communeName: string) => {
  const keys = Object.keys(restCatnat);
  const values = Object.values(restCatnat);
  const sum = Sum(values);
  return `
    <div style="
      font-size: 1rem;
      font-family: Marianne;
      font-weight: 700;
      padding: 0 0 1rem;
    ">
      ${communeName} : ${sum} arrêté(s) au total
    </div>
      ${keys.map(
    (el, i) => `
          <div style="
            margin: 0;
            padding: 0 0 0.25rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-family: Marianne;
            font-weight: 400;
          ">
            ${el} : <b> ${values[i]}</b>
          </div>`
  ).join(' ')}`;
};

export const EspacesNafTooltip = (communeName: string, naf: number) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; padding: 0; width: max-content;">
      <p style="font-size: 0.875rem; font-family: Marianne; font-weight: 400; margin: 0">${communeName} : </p> 
      <p style="font-size: 0.875rem; font-family: Marianne; font-weight: 700; margin: 0"> ${Round(naf / 10000, 1)} hectare(s)</p>
    </div>
  `;
};

export const SurfacesIrrigueesTooltip = (communeName: string, surfacesIrriguees: number | null) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; padding: 0; width: max-content;">
      <p style="font-size: 0.875rem; font-family: Marianne; font-weight: 400; margin: 0">${communeName} : </p> 
      <p style="font-size: 0.875rem; font-family: Marianne; font-weight: 700; margin: 0"> 
        ${surfacesIrriguees === null ? 'Secret statistique' : isNaN(surfacesIrriguees) ? 'Aucune donnée' : `${surfacesIrriguees} %`}
      </p>
    </div>
  `;
};

export const FragiliteEconomiqueTooltip = (communeName: string, value: number) => {
  return `
      <div style="display: flex; flex-direction: column; justify-content: space-between; padding: 0; width: max-content;">
        <p style="font-size: 1rem; font-family: Marianne; font-weight: 400; margin: 0 0 0.5rem">${communeName}</p> 
        <p style="font-size: 0.875rem; font-family: Marianne; font-weight: 400; margin: 0"> 
          ${isNaN(value) ? 'Aucune donnée' : `Part des ménages en précarité : <b>${Round(100 * Number(value), 0)} %</b>`}
        </p>
      </div>
  `;
}

export const DensiteBatiTooltip = (communeName: string, value: number) => {
  return `
      <div style="display: flex; flex-direction: column; justify-content: space-between; padding: 0; width: max-content;">
        <p style="font-size: 1rem; font-family: Marianne; font-weight: 400; margin: 0">${communeName}</p> 
        <p style="font-size: 0.875rem; font-family: Marianne; font-weight: 700; margin: 0"> 
          Densité du bâti : ${Round(value, 2)}
        </p>
      </div>
  `;
}

export const getO3Color = (valeur: number): string => {
  const valeurArrondie = Number(Round(valeur, 0));
  if (valeurArrondie >= 40) return '#B982B2';
  if (valeurArrondie >= 35) return '#C97189';
  if (valeurArrondie >= 30) return '#E06060';
  if (valeurArrondie >= 25) return '#F37D7D';
  if (valeurArrondie >= 20) return '#FC9999';
  if (valeurArrondie >= 15) return '#FFAB66';
  if (valeurArrondie >= 12) return '#FFBD6B';
  if (valeurArrondie >= 10) return '#FFD97A';
  if (valeurArrondie >= 8) return '#F5E290';
  if (valeurArrondie >= 6) return '#DFEC7B';
  if (valeurArrondie === 5) return '#C4E8A3';
  if (valeurArrondie === 4) return '#A6E4D3';
  if (valeurArrondie === 3) return '#85E6D8';
  if (valeurArrondie === 2) return '#A4F5EE';
  if (valeurArrondie === 1) return '#C8F3EE';
  return '#E0F9F7';
};

export const O3Tooltip = (valeur: number, color: string) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; padding: 0.5rem; gap: 0.5rem; align-items: center; width: max-content;">
      <div style="background-color: ${color}; width: 1rem; height: 1rem; border-radius: 2px; border: 0.5px solid #161616"></div>
      <p style="font-size: 0.875rem; font-family: Marianne; font-weight: 400; margin: 0">Nombre de jours : <b>${Round(valeur, 2)}</b></p>
    </div>
  `;
}

export const O3StationsTooltip = (valeur: number, color: string, site: string) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; padding: 0.5rem; gap: 0.5rem; align-items: center; width: inherit;">
      <div style="background-color: ${color}; width: 1rem; height: 1rem; border-radius: 2px; border: 0.5px solid #161616"></div>
      <p style="font-size: 0.875rem; font-family: Marianne; font-weight: 400; margin: 0">${site} : <b>${valeur} µg/m³</b></p>
    </div>
  `;
}

export const Patch4Tooltip = (ville: string, aggravation: string, color: string) => {
  return `
    <div>
      <p style="font-size: 1rem; font-family: Marianne; font-weight: 600; margin: 0">${ville}</p>
      <div style="display: flex; flex-direction: row; justify-content: space-between; padding: 0.25rem; gap: 0.5rem; align-items: center; width: max-content;">
        <div
        style="background-color: ${color}; width: 1rem; height: 1rem; border-radius: 2px; border: 0.5px solid #161616"
        ></div>
        <p style="font-size: 1rem; font-family: Marianne; font-weight: 400; margin: 0">${aggravation}</p> 
      </div>
    </div>
  `;
};
