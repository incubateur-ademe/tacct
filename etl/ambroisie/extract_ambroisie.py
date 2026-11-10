"""Reconstruit src/lib/data/presence_ambroisie.json à partir des cartes 2025 de l'Observatoire des ambroisies.

SOURCE
- Page : https://ambroisie-risque.info/ou-se-trouve-lambroisie-en-france/
- Carte nationale : https://ambroisie-risque.info/wp-content/uploads/2026/05/carte-nationale-artemisiifolia-V7-scaled.png
  « État des connaissances sur la présence de l'Ambroisie à feuilles d'armoise (Ambrosia artemisiifolia) en France
  entre 2005 et 2025 », Observatoire des ambroisies - FREDON France, mars 2026, extraction du 09/03/2026.
- Les 13 cartes régionales de la même édition (même légende, mêmes couleurs), utilisées en contrôle croisé.
- Page consultée et images téléchargées le 19/10/2026.

DONNÉE PRODUITE
Pour chacun des 96 départements métropolitains, la classe du nombre de communes où l'ambroisie a été signalée au
moins une fois entre 2005 et 2025 : "1-10", "11-50", "51-100" ou "100+". Ce sont les 4 classes de la source : le
nombre exact de communes n'est pas publié.

MÉTHODE
La carte n'est diffusée qu'en image. Chaque département y est rempli d'une couleur unie selon sa classe. On superpose
nos propres contours de départements sur l'image, puis on lit la couleur à l'intérieur de chacun.

1. Téléchargement (telecharger)
   Chaque image est contrôlée par son empreinte SHA-256. Si une image a changé (nouvelle version de la source), le
   script s'arrête : revérifier les couleurs de légende et la méthode avant de mettre à jour les empreintes.

2. Couleurs de légende (CLASSES, COMMUNES_TOUCHEES)
   Relevées au pixel près dans la légende de la carte. Les « communes touchées » sont dessinées par-dessus le fond
   du département et ne servent qu'à délimiter la France sur l'image.

3. Superposition des contours sur l'image (caler)
   Les contours de departements_contours.json sont projetés en Lambert-93 (EPSG:2154), la projection de la carte
   source : Web Mercator (EPSG:3857) et WGS84 (EPSG:4326) ont été testés et s'alignent nettement moins bien.
   On cherche la transformation (échelle, décalage x/y, rapport hauteur/largeur, rotation) qui place ces contours
   sur l'image :
   a. point de départ : le rectangle englobant de la France sur l'image est mis en face de celui des contours ;
   b. premier réglage : on maximise le recouvrement (intersection / union) entre les pixels « France » de l'image
      (couleur à moins de 28 d'une couleur de légende) et nos départements rastérisés, sur l'image réduite par 4 ;
   c. réglage fin : on minimise la distance moyenne entre nos limites de départements et les traits de limite
      détectés dans l'image (gris foncé sur la carte nationale, blancs sur les cartes régionales), distance
      plafonnée à 12 px pour qu'un trait manquant ne fasse pas dériver le réglage.
   Écart moyen obtenu sur la carte nationale : 1,85 px.

4. Lecture de la classe (extraire)
   Pour chaque département, on ne garde que :
   - les pixels à au moins 5 px de ses limites (8 px sur les cartes régionales), pour absorber les petits défauts
     de superposition ;
   - les pixels d'aplat : couleur à moins de 8 d'une couleur de classe, puis bord d'1 px retiré. Cela exclut les
     communes touchées, les textes et les pixels de transition entre deux couleurs.
   Chaque pixel restant vote pour la couleur de classe la plus proche ; la classe majoritaire est retenue.
   Édition 2026 : dans chaque département lisible, au moins 95,9 % des pixels votent pour la même classe
   (100 % pour presque tous).

5. Contrôle croisé (main)
   Les étapes 3 et 4 sont refaites sur les 13 cartes régionales, chacune limitée à ses départements. Si la lecture
   nationale et la lecture régionale divergent, le script s'arrête et liste les départements à trancher à la main.
   Édition 2026 : 94 départements lus identiques sur les deux cartes, aucun désaccord.
   Sur la carte régionale Bretagne, la superposition est moins précise (environ 9 px d'écart) : la lecture reste
   nette et concorde avec la carte nationale.

6. Cas particuliers
   - Hauts-de-Seine (92) : trop petit sur la carte nationale, aucun pixel exploitable ; classe lue sur la carte
     régionale (1-10).
   - Paris (75) : entièrement recouvert par « communes touchées » sur les deux cartes, aucun aplat lisible. Paris
     étant une seule commune, il ne peut être qu'en 1-10.

7. Écriture de presence_ambroisie.json, dans l'ordre de departements.json.

REPRODUIRE
Depuis la racine du dépôt : python etl/ambroisie/extract_ambroisie.py [--images DOSSIER]
--images : dossier où sont stockées les images téléchargées (par défaut : dossier temporaire du système).
Dépendances : numpy, pillow, scipy, geopandas, shapely, rasterio.
Testé avec Python 3.11, numpy 2.1, pillow 11.1, scipy 1.17, geopandas 0.14, shapely 2.0, rasterio 1.4 (environ 2 min).
Le résultat est identique d'une exécution à l'autre tant que les images sources ne changent pas.
"""
import argparse
import hashlib
import json
import sys
import tempfile
import urllib.request
from pathlib import Path

import geopandas as gpd
import numpy as np
from affine import Affine
from PIL import Image
from rasterio import features
from scipy import ndimage, optimize
from shapely.geometry import shape

Image.MAX_IMAGE_PIXELS = None

BASE_URL = 'https://ambroisie-risque.info/wp-content/uploads/2026/05/'
CONTOURS = Path('src/lib/data/departements_contours.json')
DEPARTEMENTS = Path('src/lib/data/departements.json')
SORTIE = Path('src/lib/data/presence_ambroisie.json')

CLASSES = {'1-10': (115, 163, 186), '11-50': (81, 135, 158), '51-100': (46, 106, 131), '100+': (12, 78, 103)}
COMMUNES_TOUCHEES = (7, 47, 62)

NATIONALE = ('carte-nationale-artemisiifolia-V7-scaled.png',
             '775969a00a21433fd03b0ddf6d7e9efa3d1f9d4a8eaea71f66f8f8ffb88a6c18')
# Zone de la carte nationale en pixels (x0, y0, x1, y1) : exclut le titre et la légende.
CADRE_NATIONALE = (0, 260, 2014, 2140)

# Fichier : {région}-historique-ambroisie-scaled.png -> (empreinte SHA-256, départements de la région)
REGIONS = {
    'Auvergne-Rhone-Alpes': ('202fa4cae9374e1561208ed9303042d1f16e7b08f2f07d3ff0bad1a30d186105',
                             '01 03 07 15 26 38 42 43 63 69 73 74'),
    'Bourgogne-Franche-Comte': ('0de102a675d80b0bf101ff2e299ab379a729c834fa7861f7998f0f7e43ad41c1',
                                '21 25 39 58 70 71 89 90'),
    'Bretagne': ('5283fa0548c24864a362d36ce66c0493a929942bce7612bd4b5211dd378f7bfa', '22 29 35 56'),
    'Centre-Val-de-Loire': ('bf9899bbcee4e40d45a376964851ad10430985e545534565b287bec8903a9047', '18 28 36 37 41 45'),
    'Corse': ('876607f87aca8fac0955d2b87f31423c917c3d7073ffb74b391364ef1a061b0a', '2A 2B'),
    'Grand-Est': ('dffe732dd296e7f14d755ec6d03e9ea0424455bf835ad5a8adf5cf1eff63e718', '08 10 51 52 54 55 57 67 68 88'),
    'Hauts-de-France': ('2534e5ccf6835d4a5eb75c64c43efc7f9d66c9923898fc44d47d3988ac7d640f', '02 59 60 62 80'),
    'Ile-de-France': ('f758e4f9a6472d5c65275bcafbd5ea25dd7b4aba15af7b5ea24a208e19f29e33', '75 77 78 91 92 93 94 95'),
    'Normandie': ('ce5d1b5000ba0df927bd628894304825df2b6b2ed871de1b91f2921d733f7816', '14 27 50 61 76'),
    'Nouvelle-Aquitaine': ('d4c95ec929399b943577c2a844e980b36f70be469ab1ac35da5ac3391ba25252',
                           '16 17 19 23 24 33 40 47 64 79 86 87'),
    'Occitanie': ('83e2e6079d18d8f6d9ab75501a15df5cd5c9a521a3844970c8fc2f5d08c2b73f',
                  '09 11 12 30 31 32 34 46 48 65 66 81 82'),
    'Pays-de-la-Loire': ('e6ced2de70a4ebcc2609ec0722e0caa9efc37dce3f302ab6dfd6558c20a0b058', '44 49 53 72 85'),
    'Provence-Alpes-Cote-dAzur': ('cbc1ddf1f5106aa604fb685acad83561e5f0ddb57130fa224de5e673d8577b59',
                                  '04 05 06 13 83 84'),
}


def telecharger(fichier, sha256, dossier):
    """Étape 1 : télécharge l'image si absente du dossier, puis vérifie son empreinte."""
    chemin = dossier / fichier
    if not chemin.exists():
        requete = urllib.request.Request(BASE_URL + fichier, headers={'User-Agent': 'Mozilla/5.0'})
        chemin.write_bytes(urllib.request.urlopen(requete).read())
    if hashlib.sha256(chemin.read_bytes()).hexdigest() != sha256:
        sys.exit(f'{fichier} : le fichier source a changé. Vérifier la légende et la méthode avant de mettre à jour '
                 f'l\'empreinte.')
    return chemin


def distance(img, couleurs):
    """Distance euclidienne RGB de chaque pixel à chaque couleur : tableau (hauteur, largeur, nb couleurs)."""
    c = np.array(couleurs, dtype=np.int32).reshape(-1, 3)
    return np.sqrt(((img[:, :, None, :] - c[None, None, :, :]) ** 2).sum(-1))


def matrice(p):
    """Transformation Lambert-93 -> pixels. p = (échelle, décalage x, décalage y, rapport hauteur/largeur, rotation)."""
    s, tx, ty, ratio, rot = p
    c, sn = np.cos(rot), np.sin(rot)
    return Affine(s * c, -s * sn, tx, -s * ratio * sn, -s * ratio * c, ty)


def caler(img, masque, bordures, deps):
    """Étape 3 : superpose les contours (Lambert-93) sur l'image. Renvoie la transformation et l'écart moyen en px."""
    # a. Point de départ : rectangles englobants. Les centiles écartent quelques pixels isolés hors de la France.
    ys, xs = np.nonzero(masque)
    mx0, mx1 = np.percentile(xs, 0.05), np.percentile(xs, 99.95)
    my0, my1 = np.percentile(ys, 0.05), np.percentile(ys, 99.95)
    bx0, by0, bx1, by1 = deps.total_bounds
    s0 = ((mx1 - mx0) / (bx1 - bx0) + (my1 - my0) / (by1 - by0)) / 2
    p0 = np.array([s0, mx0 - s0 * bx0, my0 + s0 * by1, (my1 - my0) / (by1 - by0) / s0, 0.0])
    geoms = list(deps.geometry)
    petit = masque[::4, ::4]

    # b. Premier réglage : recouvrement (intersection / union) entre la France de l'image et nos départements.
    def iou(p):
        r = features.rasterize(geoms, out_shape=petit.shape, transform=~matrice(p) * Affine.scale(4)).astype(bool)
        return -(r & petit).sum() / ((r | petit).sum() + 1e-9)

    e1 = np.array([s0 * 0.01, 10, 10, 0.01, 0.005])
    p1 = p0 + optimize.minimize(lambda q: iou(p0 + q * e1), np.zeros(5), method='Powell').x * e1

    # c. Réglage fin : distance moyenne entre des points pris le long de nos limites et le trait de limite le plus
    # proche détecté dans l'image, plafonnée à 12 px.
    pts = []
    for geom in geoms:
        for poly in (geom.geoms if geom.geom_type == 'MultiPolygon' else [geom]):
            for anneau in [poly.exterior, *poly.interiors]:
                n = max(int(anneau.length / ((bx1 - bx0) / 3000)), 4)
                pts.extend(anneau.interpolate(i / n, normalized=True).coords[0] for i in range(n))
    pts = np.c_[np.array(pts), np.ones(len(pts))]
    dist_bordures = ndimage.distance_transform_edt(~bordures)
    H, W = masque.shape

    def chamfer(p):
        u, v = (pts @ np.array(matrice(p)).reshape(3, 3)[:2].T).T
        ok = (u >= 0) & (u < W - 1) & (v >= 0) & (v < H - 1)
        d = np.full(len(u), 12.0)
        d[ok] = np.minimum(ndimage.map_coordinates(dist_bordures, [v[ok], u[ok]], order=1), 12)
        return d.mean()

    e2 = np.array([s0 * 0.002, 2, 2, 0.002, 0.001])
    p2 = p1 + optimize.minimize(lambda q: chamfer(p1 + q * e2), np.zeros(5), method='Powell').x * e2
    return matrice(p2), chamfer(p2)


def extraire(chemin, deps, cadre=None, carte_regionale=False, marge=5):
    """Étapes 3 et 4 sur une image. Renvoie {code: (classe, part des votes, nb de pixels votants)} et l'écart moyen."""
    img = np.asarray(Image.open(chemin).convert('RGB')).astype(np.int32)
    H, W, _ = img.shape
    x0, y0, x1, y1 = cadre or (0, 0, W, H)
    dans_cadre = np.zeros((H, W), bool)
    dans_cadre[y0:y1, x0:x1] = True

    # Pixels « France » : couleur à moins de 28 d'une couleur de classe ou de « communes touchées ».
    d_classes = distance(img, list(CLASSES.values()))
    masque = ((d_classes.min(-1) < 28) | (distance(img, COMMUNES_TOUCHEES)[:, :, 0] < 28)) & dans_cadre
    if carte_regionale:
        # Pas de cadre fixe sur les cartes régionales : on garde la plus grande zone d'un seul tenant, ce qui écarte
        # les carrés de légende et les logos.
        lab, _ = ndimage.label(ndimage.binary_dilation(masque, iterations=6))
        masque &= lab == np.argmax(np.bincount(lab.ravel())[1:]) + 1

    # Traits de limite : pixels gris neutres, foncés sur la carte nationale, blancs sur les cartes régionales.
    ecart = img.max(-1) - img.min(-1)
    if carte_regionale:
        bordures = (img.min(-1) > 215) & (ecart < 15) & ndimage.binary_dilation(masque, iterations=4)
    else:
        bordures = (img.max(-1) < 70) & (ecart < 12) & dans_cadre

    F, chamfer = caler(img, masque, bordures, deps)
    labels = features.rasterize(((g, i + 1) for i, g in enumerate(deps.geometry)), out_shape=(H, W),
                                transform=~F, dtype='int32')

    # Étape 4 : intérieur du département (à plus de `marge` px de ses limites) et pixels d'aplat uniquement.
    interieur = (ndimage.maximum_filter(labels, size=2 * marge + 1) ==
                 ndimage.minimum_filter(labels, size=2 * marge + 1)) & (labels > 0)
    aplat = ndimage.binary_erosion(d_classes.min(-1) < 8, iterations=1)
    plus_proche = d_classes.argmin(-1)

    noms = list(CLASSES)
    resultats = {}
    for i, code in enumerate(deps['code']):
        votes = np.bincount(plus_proche[interieur & aplat & (labels == i + 1)], minlength=len(noms))
        n = int(votes.sum())
        resultats[code] = (noms[int(votes.argmax())], float(votes.max() / n), n) if n else (None, 0.0, 0)
    return resultats, chamfer


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--images', type=Path, default=Path(tempfile.gettempdir()) / 'ambroisie_2025')
    args = parser.parse_args()
    args.images.mkdir(parents=True, exist_ok=True)

    contours = json.loads(CONTOURS.read_text(encoding='utf-8'))
    codes = sorted(c for c in contours if not c.startswith('97'))
    deps = gpd.GeoDataFrame({'code': codes}, geometry=[shape(contours[c]).buffer(0) for c in codes],
                            crs='EPSG:4326').to_crs('EPSG:2154')

    nationale, chamfer = extraire(telecharger(*NATIONALE, args.images), deps, cadre=CADRE_NATIONALE)
    print(f'nationale : écart moyen contours/limites {chamfer:.2f} px')

    # Étape 5 : seconde lecture sur les cartes régionales.
    regionale = {}
    for region, (sha256, codes_region) in REGIONS.items():
        chemin = telecharger(f'{region}-historique-ambroisie-scaled.png', sha256, args.images)
        res, chamfer = extraire(chemin, deps[deps['code'].isin(codes_region.split())].reset_index(drop=True),
                                carte_regionale=True, marge=8)
        regionale.update(res)
        print(f'{region} : écart moyen contours/limites {chamfer:.2f} px')

    # Étapes 5 et 6 : comparaison des deux lectures et cas particuliers.
    presence, conflits = {}, []
    for code in codes:
        (cn, pn, nn), (cr, pr, nr) = nationale[code], regionale[code]
        if cn and cr and cn != cr:
            conflits.append(f'{code} : nationale {cn} ({pn:.0%}), régionale {cr} ({pr:.0%})')
        elif cn or cr:
            presence[code] = cn or cr
            if min(p for c, p in [(cn, pn), (cr, pr)] if c) < 0.8:
                print(f'{code} : lecture peu nette (nationale {cn} {pn:.0%}, régionale {cr} {pr:.0%})')
        elif code == '75':
            # Paris est une seule commune, entièrement recouverte par « communes touchées » : 1 commune au plus.
            presence[code] = '1-10'
        else:
            conflits.append(f'{code} : aucun pixel exploitable')
        if not (nn and nr) and code in presence:
            print(f'{code} : lu sur une seule carte ou déduit -> {presence[code]}')
    if conflits:
        sys.exit('À trancher à la main :\n' + '\n'.join(conflits))

    # Étape 7 : écriture.
    ordre = json.loads(DEPARTEMENTS.read_text(encoding='utf-8'))
    sortie = {code: presence[code] for code in ordre if code in presence}
    SORTIE.write_text(json.dumps(sortie, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(f'{SORTIE} : {len(sortie)} départements',
          {c: sum(v == c for v in sortie.values()) for c in CLASSES})


if __name__ == '__main__':
    main()
