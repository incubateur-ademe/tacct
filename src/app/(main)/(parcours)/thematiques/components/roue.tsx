"use client";
import { Loader } from "@/components/ui/loader";
import { HtmlTooltip } from "@/components/utils/Tooltips";
import { Body } from "@/design-system/base/Textes";
import { Any } from "@/lib/utils/types";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
// Import CircleType (types seront déclarés en tant que any)
// @ts-ignore
import CircleType from 'circletype';
import {
  categoriesNoeuds,
  liensEntreThematiques,
  nodeCategoryMapping,
  nomThematiques,
  PositionArcsDonut
} from '../constantes/categories';
import {
  categoryColors,
  categorySelectedBorderColors,
  categorySelectedColors
} from '../constantes/colors';
import {
  categorieTextParametres,
  DistanceTextes
} from '../constantes/textesSVG';

type NoeudRoue = {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  textColor: string;
  labelRadius?: number;
  xOffset?: number;
  yOffset?: number;
  category?: string;
  originalIndex?: number;
  disabled?: boolean;
};

interface RoueSystemiqueProps {
  onItemSelect?: (item: string | null) => void;
  selectedItem?: string | null;
}

const dimensions = {
  width: 655,
  height: 600,
  margin: { top: 0, right: 0, bottom: 0, left: 0 }
};

const getCategoryColor = (label: string) => {
  const category =
    nodeCategoryMapping[label as keyof typeof nodeCategoryMapping];
  return category
    ? categoryColors[category as keyof typeof categoryColors]
    : '#D9D9D9';
};

const getDisabledTooltipContent = (label: string) => {
  return `La thématique "${label}" n'est pas encore disponible.`;
};

const RoueSystemique = ({
  onItemSelect,
  selectedItem
}: RoueSystemiqueProps) => {
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = Number(width) + margin.left + margin.right + 15;
  const svgHeight = Number(height) + margin.top + margin.bottom;
  const [selectedThematique, setSelectedThematique] = useState<string | null>(
    selectedItem || null
  );
  const radiusRoueSytemique = 180;
  const defaultLabelRadius = radiusRoueSytemique + 70;
  const NoeudsRoue: NoeudRoue[] = [];
  // Paramètre pour la rotation de la roue (en degrés)
  const RoueRotation = 25;
  const [categoriePositions, setCategoriePositions] = useState<{
    [key: string]: {
      x: number;
      y: number;
      rotation: number;
    };
  }>({});

  for (let i = 0; i < nomThematiques.length; i++) {
    const angle =
      (2 * Math.PI * i) / nomThematiques.length +
      (RoueRotation * Math.PI) / 180;
    const label = nomThematiques[i].label;
    const category =
      nodeCategoryMapping[label as keyof typeof nodeCategoryMapping];
    NoeudsRoue.push({
      id: `thematique-${i + 1}`,
      ...nomThematiques[i],
      x: radiusRoueSytemique * Math.cos(angle),
      y: radiusRoueSytemique * Math.sin(angle),
      size: 20,
      color: getCategoryColor(label),
      textColor: '#222',
      category: category
    });
  }

  useEffect(() => {
    if (selectedItem !== undefined) {
      setSelectedThematique(selectedItem);
    }
  }, [selectedItem]);

  const handleItemSelect = (item: string | null) => {
    setSelectedThematique(item);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  // Get tous les noeuds liés au nœud sélectionné
  const getThematiquesLiees = (nodeLabel: string) => {
    const linkedNodeIds: string[] = [];
    liensEntreThematiques.forEach((link) => {
      if (link.source === nodeLabel) {
        linkedNodeIds.push(link.target);
      }
    });
    return linkedNodeIds;
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const transitionDuration = prefersReducedMotion ? 0 : 200;
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove();
    const svg = svgEl
      .append('g')
      .attr('transform', `translate(${svgWidth / 2},${svgHeight / 2})`);
    const defs = svg.append('defs');
    // liens directs entre les cercles des thématiques
    svg
      .selectAll('path.l2tol2')
      .data(liensEntreThematiques)
      .enter()
      .append('path')
      .attr('class', 'l2tol2')
      .attr('d', (d) => {
        const sourceNode = NoeudsRoue.find((n) => n.label === d.source);
        const targetNode = NoeudsRoue.find((n) => n.label === d.target);
        if (!sourceNode || !targetNode) return null;

        // Calculer les points de départ et d'arrivée sur les bords des cercles
        const circleRadius = sourceNode.size; // Rayon du cercle
        // Direction vers le centre (0,0) pour chaque cercle
        const sourceAngleToCenter = Math.atan2(-sourceNode.y, -sourceNode.x);
        const targetAngleToCenter = Math.atan2(-targetNode.y, -targetNode.x);
        // Points de départ et d'arrivée sur les bords des cercles (côté centre)
        const startX =
          sourceNode.x + circleRadius * Math.cos(sourceAngleToCenter);
        const startY =
          sourceNode.y + circleRadius * Math.sin(sourceAngleToCenter);
        const endX =
          targetNode.x + circleRadius * Math.cos(targetAngleToCenter);
        const endY =
          targetNode.y + circleRadius * Math.sin(targetAngleToCenter);
        const mx = (startX + endX) / 2;
        const my = (startY + endY) / 2;

        // Distance entre les points de départ et d'arrivée
        const dist = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        // Force de la courbe basée sur curveRadius
        const curveStrength = d.curveRadius ?? 0.25;
        // Direction vers l'intérieur (vers le centre du design)
        const centerDirection = Math.atan2(-my, -mx); // Direction vers le centre (0,0)
        // Point de contrôle déplacé vers l'intérieur du design
        const controlDistance = dist * curveStrength * d.curve; // curve peut être positif ou négatif
        const cpx = mx + controlDistance * Math.cos(centerDirection);
        const cpy = my + controlDistance * Math.sin(centerDirection);
        return `M${startX},${startY} Q${cpx},${cpy} ${endX},${endY}`;
      })
      .attr('fill', 'none')
      .attr(
        'stroke',
        (
          d: {
            source: string;
            target: string;
            curveRadius?: number;
            curve?: number;
          },
          i: number
        ) => {
          if (selectedThematique) {
            const sourceLabel = d.source;

            if (sourceLabel === selectedThematique) {
              // Créer un gradient pour ce lien
              const sourceNode = NoeudsRoue.find((n) => n.label === d.source);
              const targetNode = NoeudsRoue.find((n) => n.label === d.target);
              if (sourceNode && targetNode) {
                const sourceCategory =
                  nodeCategoryMapping[
                    sourceNode.label as keyof typeof nodeCategoryMapping
                  ];
                const targetCategory =
                  nodeCategoryMapping[
                    targetNode.label as keyof typeof nodeCategoryMapping
                  ];
                const sourceColor = sourceCategory
                  ? categorySelectedBorderColors[
                      sourceCategory as keyof typeof categorySelectedBorderColors
                    ]
                  : '#800020';
                const targetColor = targetCategory
                  ? categorySelectedBorderColors[
                      targetCategory as keyof typeof categorySelectedBorderColors
                    ]
                  : '#800020';
                // Calculer la direction du gradient en fonction de la position des nœuds
                const angle = Math.atan2(
                  targetNode.y - sourceNode.y,
                  targetNode.x - sourceNode.x
                );
                const x1 = 50 + 50 * Math.cos(angle + Math.PI);
                const y1 = 50 + 50 * Math.sin(angle + Math.PI);
                const x2 = 50 + 50 * Math.cos(angle);
                const y2 = 50 + 50 * Math.sin(angle);
                // Créer un gradient unique pour ce lien
                const gradientId = `gradient-${i}`;
                const gradient = defs
                  .append('linearGradient')
                  .attr('id', gradientId)
                  .attr('x1', `${x1}%`)
                  .attr('y1', `${y1}%`)
                  .attr('x2', `${x2}%`)
                  .attr('y2', `${y2}%`);
                gradient
                  .append('stop')
                  .attr('offset', '0%')
                  .attr('stop-color', sourceColor);
                gradient
                  .append('stop')
                  .attr('offset', '100%')
                  .attr('stop-color', targetColor);
                return `url(#${gradientId})`;
              }
              return '#800020';
            }
          }
          return 'transparent'; // Liens invisibles par défaut
        }
      )
      .attr(
        'stroke-width',
        (d: {
          source: string;
          target: string;
          curveRadius?: number;
          curve?: number;
        }) => {
          if (selectedThematique) {
            const sourceLabel = d.source;
            if (sourceLabel === selectedThematique) {
              return 1.5;
            }
          }
          return 0; // Largeur 0 quand invisible
        }
      );

    svg
      .selectAll('circle.l2')
      .data(NoeudsRoue)
      .enter()
      .append('circle')
      .attr('class', 'l2')
      .attr('r', (d: { size: number }) => d.size)
      .attr('fill', (d: { label: string; color: string }) => {
        if (selectedThematique === d.label) {
          // Le cercle sélectionné utilise la couleur de contour (la plus foncée)
          const category =
            nodeCategoryMapping[d.label as keyof typeof nodeCategoryMapping];
          return category
            ? categorySelectedBorderColors[
                category as keyof typeof categorySelectedBorderColors
              ]
            : '#800020';
        }
        if (
          selectedThematique &&
          getThematiquesLiees(selectedThematique).includes(d.label)
        ) {
          // Les cercles liés prennent la couleur de sélection de leur propre catégorie (moins foncée)
          const category =
            nodeCategoryMapping[d.label as keyof typeof nodeCategoryMapping];
          return category
            ? categorySelectedColors[
                category as keyof typeof categorySelectedColors
              ]
            : '#800020';
        }
        // Couleur normale pour les cercles non sélectionnés et non liés (mais invisibles)
        return d.color;
      })
      .attr('stroke', (d: { label: string; color: string }) => {
        if (selectedThematique === d.label) {
          // Utilise la couleur de contour de sélection spécifique à la catégorie pour le cercle sélectionné
          const category =
            nodeCategoryMapping[d.label as keyof typeof nodeCategoryMapping];
          return category
            ? categorySelectedBorderColors[
                category as keyof typeof categorySelectedBorderColors
              ]
            : '#800020';
        }
        if (
          selectedThematique &&
          getThematiquesLiees(selectedThematique).includes(d.label)
        ) {
          // Les cercles liés prennent aussi la couleur de contour de sélection de leur propre catégorie
          const category =
            nodeCategoryMapping[d.label as keyof typeof nodeCategoryMapping];
          return category
            ? categorySelectedBorderColors[
                category as keyof typeof categorySelectedBorderColors
              ]
            : '#800020';
        }
        return d.color; // Utilise la couleur de la catégorie pour le contour
      })
      .attr('stroke-width', () => {
        // Utile seulement si on veut des différences de taille de contour entre les cercles
        // if (selectedThematique === d.label) return 1.5;
        // if (selectedThematique && getThematiquesLiees(selectedThematique).includes(d.label)) return 1.5;
        return 1.5;
      })
      .attr('opacity', (d: { label: string; color: string }) => {
        // Afficher seulement les cercles sélectionnés ou liés
        if (selectedThematique === d.label) return 1; // Cercle sélectionné visible
        if (
          selectedThematique &&
          getThematiquesLiees(selectedThematique).includes(d.label)
        )
          return 1; // Cercles liés visibles
        return 0; // Tous les autres cercles sont cachés
      })
      .attr('cx', (d: { x: number }) => d.x)
      .attr('cy', (d: { y: number }) => d.y);

    // Création des arcs de la roue (forme de donut) pour les catégories (au premier plan)
    const donutRadius = radiusRoueSytemique;
    const donutThickness = 36; // Épaisseur du donut
    const innerRadius = 16 + (donutRadius - donutThickness / 2);
    const outerRadius = donutRadius + donutThickness / 2 + 8;

    // Grouper en utilisant l'ordre d'origine des nœuds (pas les angles calculés)
    NoeudsRoue.forEach((node: NoeudRoue, index: number) => {
      if (
        node.category &&
        categoriesNoeuds[node.category as keyof typeof categoriesNoeuds]
      ) {
        categoriesNoeuds[node.category as keyof typeof categoriesNoeuds].push({
          ...node,
          originalIndex: index
        });
      }
    });

    // Rotation globale pour ajuster la position de tous les textes de catégories (en degrés)
    // Ajustez cette valeur pour faire tourner tous les textes en même temps
    const globalCategoryRotation = -90;

    // Dessiner les arcs de donut en utilisant les indices d'origine
    const newCategoriePositions: {
      [key: string]: {
        x: number;
        y: number;
        rotation: number;
      };
    } = {};

    Object.entries(categoriesNoeuds).forEach(([category, nodes]) => {
      if (nodes.length > 0) {
        // Calculer les angles des arcs de cercle (en radians)
        const { startAngle, endAngle } = PositionArcsDonut(category);

        // Gérer le cas où l'arc traverse 0° (par exemple si les éléments sont en fin et début de cercle)
        //         const startIndex = indices[0];
        // const endIndex = indices[indices.length - 1];
        // if (endIndex - startIndex > nomThematiques.length / 2) {
        //   // L'arc devrait aller dans l'autre direction
        //   endAngle = startAngle + (2 * Math.PI * nodes.length) / nomThematiques.length + 0.2;
        // }

        const arc = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(startAngle)
          .endAngle(endAngle);

        svg
          .append('path')
          .attr('d', arc as Any)
          .attr('fill', categoryColors[category as keyof typeof categoryColors])
          .attr('opacity', 1)
          .attr(
            'class',
            `donut-arc donut-${category.replace(/\s+/g, '-').toLowerCase()}`
          );

        // Calculer la position pour le texte avec distance personnalisable
        const textRadius = DistanceTextes(category);
        const midAngle = (startAngle + endAngle) / 2;
        const parametres =
          categorieTextParametres[
            category as keyof typeof categorieTextParametres
          ];
        // Appliquer la rotation globale, le décalage individuel ET la rotation par rapport au centre
        const adjustedMidAngle =
          midAngle +
          (parametres.angleOffset * Math.PI) / 180 +
          (globalCategoryRotation * Math.PI) / 180;
        // Position pour le conteneur du texte courbé
        const x = svgWidth / 2 + textRadius * Math.cos(adjustedMidAngle);
        const y = svgHeight / 2 + textRadius * Math.sin(adjustedMidAngle);
        newCategoriePositions[category] = { x, y, rotation: 0 };
      }
    });
    setCategoriePositions(newCategoriePositions);

    // Labels des catégories avec CircleType
    svg
      .selectAll('g.l2-label')
      .data(NoeudsRoue)
      .enter()
      .append('g')
      .attr('class', 'l2-label')
      .attr('transform', (d: NoeudRoue) => {
        const labelRadius = d.labelRadius ? d.labelRadius : defaultLabelRadius;
        const xOffset = d.xOffset ? d.xOffset : 0;
        const yOffset = d.yOffset ? d.yOffset : 0;
        const nodeAngle = Math.atan2(d.y, d.x);
        const x = labelRadius * Math.cos(nodeAngle);
        const y = labelRadius * Math.sin(nodeAngle);
        return `translate(${x + xOffset},${y + yOffset})`;
      })
      .style('cursor', (d: NoeudRoue) => {
        const thematique = nomThematiques.find((t) => t.label === d.label);
        return thematique?.disabled ? 'help' : 'pointer';
      })
      .on('click', (event: Any, d: NoeudRoue) => {
        const thematique = nomThematiques.find((t) => t.label === d.label);
        if (!thematique?.disabled) {
          handleItemSelect(selectedThematique === d.label ? null : d.label);
        }
      })
      .on('mouseenter', function (event: Any, d: NoeudRoue) {
        const thematique = nomThematiques.find((t) => t.label === d.label);
        if (thematique?.disabled) return;
        if (
          selectedThematique !== d.label &&
          !(
            selectedThematique &&
            getThematiquesLiees(selectedThematique).includes(d.label)
          )
        ) {
          const category =
            nodeCategoryMapping[d.label as keyof typeof nodeCategoryMapping];
          const hoverColor = category
            ? categoryColors[category as keyof typeof categoryColors]
            : '#E5E5E5';
          d3.select(this)
            .select('rect')
            .transition()
            .duration(transitionDuration)
            .attr('fill', hoverColor)
            .attr('stroke-dasharray', '');
        }
      })
      .on('mouseleave', function (event: Any, d: NoeudRoue) {
        const thematique = nomThematiques.find((t) => t.label === d.label);
        if (thematique?.disabled) return;
        if (
          selectedThematique !== d.label &&
          !(
            selectedThematique &&
            getThematiquesLiees(selectedThematique).includes(d.label)
          )
        ) {
          d3.select(this)
            .select('rect')
            .transition()
            .duration(transitionDuration)
            .attr('fill', '#fff')
            .attr('stroke-dasharray', '5 0');
        }
      })
      .attr('tabindex', (d: NoeudRoue) => {
        const thematique = nomThematiques.find((t) => t.label === d.label);
        return thematique?.disabled ? '-1' : '0';
      })
      .attr('role', 'button')
      .attr('aria-label', (d: NoeudRoue) => d.label)
      .attr('aria-pressed', (d: NoeudRoue) =>
        selectedThematique === d.label ? 'true' : 'false'
      )
      .on('keydown', (event: Any, d: NoeudRoue) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const thematique = nomThematiques.find((t) => t.label === d.label);
          if (!thematique?.disabled) {
            handleItemSelect(selectedThematique === d.label ? null : d.label);
          }
        }
      })
      .on('focus', function (event: Any, d: NoeudRoue) {
        const thematique = nomThematiques.find((t) => t.label === d.label);
        if (thematique?.disabled) return;
        if (
          selectedThematique !== d.label &&
          !(
            selectedThematique &&
            getThematiquesLiees(selectedThematique).includes(d.label)
          )
        ) {
          const category =
            nodeCategoryMapping[d.label as keyof typeof nodeCategoryMapping];
          const hoverColor = category
            ? categoryColors[category as keyof typeof categoryColors]
            : '#E5E5E5';
          d3.select(this)
            .select('rect')
            .transition()
            .duration(transitionDuration)
            .attr('fill', hoverColor)
            .attr('stroke-dasharray', '');
        }
      })
      .on('blur', function (event: Any, d: NoeudRoue) {
        const thematique = nomThematiques.find((t) => t.label === d.label);
        if (thematique?.disabled) return;
        if (
          selectedThematique !== d.label &&
          !(
            selectedThematique &&
            getThematiquesLiees(selectedThematique).includes(d.label)
          )
        ) {
          d3.select(this)
            .select('rect')
            .transition()
            .duration(transitionDuration)
            .attr('fill', '#fff')
            .attr('stroke-dasharray', '5 0');
        }
      })
      .each(function (d: NoeudRoue) {
        // Si le label fait plus de 12 caractères, le diviser en lignes
        const charsPerLine = 12;
        const words = d.label.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        words.forEach((word: string) => {
          if ((currentLine + ' ' + word).trim().length > charsPerLine) {
            if (currentLine) lines.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine += ' ' + word;
          }
        });
        if (currentLine) lines.push(currentLine.trim());
        const tempText = d3
          .select(this)
          .append('text')
          .attr('font-size', 14)
          .attr('font-family', 'Marianne');
        let maxLineWidth = 0;
        lines.forEach((line) => {
          tempText.text(line);
          const textNode = tempText.node();
          let textWidth = 0;
          if (
            textNode &&
            typeof textNode.getComputedTextLength === 'function'
          ) {
            textWidth = textNode.getComputedTextLength();
          }
          if (textWidth > maxLineWidth) maxLineWidth = textWidth;
        });
        tempText.remove();
        const thematique = nomThematiques.find((t) => t.label === d.label);
        let rectFill = '#fff';
        let rectStroke = d.color;
        let textFill = d.textColor;
        let strokeDasharray = '5 0';
        const paddingX = 16;
        const paddingY = 8;
        const fontSize = 14;

        if (thematique?.disabled) {
          rectStroke = 'var(--gris-medium)';
          textFill = 'var(--gris-medium)';
          strokeDasharray = '5 0';
        } else if (selectedThematique === d.label) {
          // L'item sélectionné utilise la couleur de contour la plus foncée
          const category =
            nodeCategoryMapping[d.label as keyof typeof nodeCategoryMapping];
          rectFill = category
            ? categorySelectedBorderColors[
                category as keyof typeof categorySelectedBorderColors
              ]
            : '#800020';
          rectStroke = category
            ? categorySelectedBorderColors[
                category as keyof typeof categorySelectedBorderColors
              ]
            : '#800020';
          textFill = '#fff';
          strokeDasharray = '';
        } else if (
          selectedThematique &&
          getThematiquesLiees(selectedThematique).includes(d.label)
        ) {
          // Les items liés ont la couleur de sélection de leur catégorie en remplissage
          const category =
            nodeCategoryMapping[d.label as keyof typeof nodeCategoryMapping];
          rectFill = category
            ? categoryColors[category as keyof typeof categoryColors]
            : '#E5E5E5';
          rectStroke = category
            ? categorySelectedBorderColors[
                category as keyof typeof categorySelectedBorderColors
              ]
            : '#800020';
          textFill = '#222';
          strokeDasharray = '';
        }
        const boxWidth = maxLineWidth + paddingX * 2;
        const boxHeight = lines.length * fontSize + paddingY * 2;
        d3.select(this)
          .append('rect')
          .attr('x', -boxWidth / 2)
          .attr('y', -boxHeight / 2)
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .attr('fill', rectFill)
          .attr('stroke', rectStroke)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', strokeDasharray)
          .attr('rx', lines.length > 1 ? 22 : 15)
          .attr('ry', lines.length > 1 ? 22 : 50);
        const textElem = d3
          .select(this)
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', textFill)
          .attr('font-size', fontSize)
          .attr('font-family', 'Marianne')
          .attr('y', -boxHeight / 2 + paddingY + fontSize * 0.8);
        lines.forEach((line, i) => {
          textElem
            .append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? 0 : fontSize)
            .text(line);
        });
      });
  }, [selectedThematique, svgWidth, svgHeight]);

  return (
    <div ref={wrapperRef} style={{ width: '100%' }}>
      <h1 className="fr-sr-only">Roue des thématiques</h1>
      <div style={{ height: svgHeight * scale, overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: svgWidth, height: svgHeight, transform: `scale(${scale})`, transformOrigin: 'top left', margin: '0 auto' }}>
          <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            role="img"
            aria-label="Roue systémique des thématiques du territoire"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, overflow: 'visible' }}
          />

      {/* Tooltip pour les thématiques indisponibles */}
      {NoeudsRoue.map((node, index) => {
        const thematique = nomThematiques.find((t) => t.label === node.label);
        if (!thematique?.disabled) return null;
        const labelRadius = node.labelRadius
          ? node.labelRadius
          : defaultLabelRadius;
        const xOffset = node.xOffset ? node.xOffset : 0;
        const yOffset = node.yOffset ? node.yOffset : 0;
        const nodeAngle = Math.atan2(node.y, node.x);
        const x = labelRadius * Math.cos(nodeAngle) + xOffset + svgWidth / 2;
        const y = labelRadius * Math.sin(nodeAngle) + yOffset + svgHeight / 2;

        return (
          <HtmlTooltip
            key={`tooltip-${index}`}
            title={getDisabledTooltipContent(node.label)}
            placement="top"
          >
            <div
              style={{
                position: 'absolute',
                left: node.label.length > 10 ? x - 55 : x - 40,
                top: node.label.length > 10 ? y - 25 : y - 15,
                width: node.label.length > 10 ? 110 : 80,
                height: node.label.length > 10 ? 50 : 30,
                cursor: 'help',
                zIndex: 2,
                pointerEvents: thematique?.disabled ? 'auto' : 'none'
              }}
            />
          </HtmlTooltip>
        );
      })}

          {/* Texte central qui disparaît lors de la sélection */}
          {
            svgRef && svgRef.current ? (
              <div
                aria-hidden={!!selectedThematique}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  maxWidth: '300px',
                  opacity: selectedThematique ? 0 : 1,
                  transition: selectedThematique ? 'none' : 'opacity 0.5s ease-in-out',
                  zIndex: 3,
                }}
              >
                <p style={{
                  fontSize: '16px',
                  color: '#23282B',
                  fontWeight: 700,
                  lineHeight: "normal",
                  letterSpacing: "0.4px",
                  margin: 0
                }}>
                  Votre territoire est un système où tout est lié.
                </p>
                <br />
                <Body>
                  Explorez les thématiques et découvrez comment elles peuvent être impactées par les aléas climatiques
                </Body>
              </div>
            ) : <div style={{ display: "flex", justifyContent: "center" }}><Loader /></div>
          }

      {/* Textes des catégories avec CircleType - contrôle individuel */}
      {/* Cadre de vie */}
      {categoriePositions['Cadre de vie'] && (
        <div
          ref={(el) => {
            if (el) {
              const existingInstance = (el as Any).circleTypeInstance;
              if (existingInstance) {
                existingInstance.destroy();
              }
              const circleType = new (CircleType as Any)(el);
              circleType.radius(200); // Courbure pour Cadre de vie
              circleType.dir(-1); // Direction pour Cadre de vie
              (el as Any).circleTypeInstance = circleType;
            }
          }}
          style={{
            position: 'absolute',
            left: `${categoriePositions['Cadre de vie'].x}px`,
            top: `${categoriePositions['Cadre de vie'].y - 78}px`,
            transform: `rotate(0deg)`, // Rotation pour Cadre de vie
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Marianne',
            letterSpacing: '0.3em',
            color: categorySelectedBorderColors['Cadre de vie'],
            pointerEvents: 'none',
            transformOrigin: 'center center',
            zIndex: 2,
            whiteSpace: 'nowrap'
          }}
        >
          Cadre de vie
        </div>
      )}

      {/* Ressources naturelles */}
      {categoriePositions['Ressources naturelles'] && (
        <div
          ref={(el) => {
            if (el) {
              const existingInstance = (el as Any).circleTypeInstance;
              if (existingInstance) {
                existingInstance.destroy();
              }
              const circleType = new (CircleType as Any)(el);
              circleType.radius(200); // Courbure pour Ressources naturelles
              circleType.dir(0.5); // Direction pour Ressources naturelles
              (el as Any).circleTypeInstance = circleType;
            }
          }}
          style={{
            position: 'absolute',
            left: `${categoriePositions['Ressources naturelles'].x + 39}px`,
            top: `${categoriePositions['Ressources naturelles'].y - 42}px`,
            transform: `rotate(-54deg)`, // Rotation pour Ressources naturelles
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Marianne',
            color: categorySelectedBorderColors['Ressources naturelles'],
            pointerEvents: 'none',
            transformOrigin: 'center center',
            zIndex: 2,
            whiteSpace: 'nowrap'
          }}
        >
          Ressources naturelles
        </div>
      )}
      {/* {categoriePositions["Ressources naturelles"] && (
        <Image
          src={RessourcesNaturellesTexte}
          style={{
            position: 'absolute',
            left: `${categoriePositions["Ressources naturelles"].x - 116}px`,
            top: `${categoriePositions["Ressources naturelles"].y - 36}px`,
            transform: `rotate(-44deg) scale(0.9)`, // Rotation pour Ressources naturelles
            color: categorySelectedBorderColors["Ressources naturelles"],
            pointerEvents: 'none',
            transformOrigin: 'center center',
            zIndex: 2,
            whiteSpace: 'nowrap'
          }}
          alt="Ressources naturelles"
        />
      )} */}

      {/* Ressources économiques */}
      {categoriePositions['Ressources économiques'] && (
        <div
          ref={(el) => {
            if (el) {
              const existingInstance = (el as Any).circleTypeInstance;
              if (existingInstance) {
                existingInstance.destroy();
              }
              const circleType = new (CircleType as Any)(el);
              circleType.radius(200); // Courbure pour Ressources économiques
              circleType.dir(0.5); // Direction pour Ressources économiques
              (el as Any).circleTypeInstance = circleType;
            }
          }}
          style={{
            position: 'absolute',
            left: `${categoriePositions['Ressources économiques'].x - 38}px`,
            top: `${categoriePositions['Ressources économiques'].y - 37}px`,
            transform: `rotate(52deg)`, // Rotation pour Ressources économiques
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Marianne',
            color: categorySelectedBorderColors['Ressources économiques'],
            pointerEvents: 'none',
            transformOrigin: 'center center',
            zIndex: 2,
            whiteSpace: 'nowrap'
          }}
        >
          Ressources économiques
        </div>
      )}
    </div>
  );
};

export default RoueSystemique;
