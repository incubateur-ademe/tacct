# Générer des tuiles vectorielles (MVT) à partir d'un GeoDataFrame

## 🎯 Objectif

Transformer un dataset géographique (GeoDataFrame) en un jeu de tuiles vectorielles `{z}/{x}/{y}.pbf` hébergées sur un bucket S3, prêtes à être utilisées dans n'importe quelle application cartographique.

## Pipeline

1. Préparer les données (GeoPandas)
2. Exporter un GeoJSON optimisé
3. Générer un `.mbtiles` (Tippecanoe via Docker)
4. Extraire les tuiles MVT
5. Uploader sur S3

## 🛠️ Outils requis

- Python / GeoPandas (ex : Jupyter Notebook)
- Docker Desktop (Windows / Mac / Linux)
- PowerShell ou terminal classique
- Outil S3 compatible (Scaleway)

---

## 1️⃣ Préparation des données (GeoPandas)

**But :** nettoyer les attributs, reprojeter en Web Mercator (EPSG:3857), simplifier légèrement la géométrie, exporter un fichier prêt pour le tuilage.

```python
import geopandas as gpd

# df = GeoDataFrame de départ, en EPSG:4326

# 1. Conserver les colonnes essentielles (identifiant obligatoire)
df_small = df[["id_colonne", "indicateur_valeur", "geometry"]].copy()

# 2. Reprojection en Web Mercator
df_small = df_small.to_crs(3857)

# 3. Simplification légère (10–20 mètres)
df_small["geometry"] = df_small.geometry.simplify(
    tolerance=10,
    preserve_topology=True
)

# 4. Export GeoJSON
df_small.to_file("clean_layer.geojson", driver="GeoJSON")
```

**👉 Résultat :** un fichier `clean_layer.geojson` propre et léger.

---

## 2️⃣ Générer un fichier `.mbtiles` avec Tippecanoe (via Docker)

**But :** convertir le GeoJSON en un fichier compact contenant toutes les tuiles.

### Commande PowerShell

```powershell
docker run --rm `
  -v "C:\path\to\folder:/data" `
  -w /data `
  klokantech/tippecanoe `
  tippecanoe -l layer_name -o output_z13.mbtiles -Z 4 -z 13 -s EPSG:3857 clean_layer.geojson
```

### Explications des paramètres

- `-v "path/to/folder:/data"` : monte le dossier contenant le GeoJSON
- `-Z 4` : zoom minimal
- `-z 13` : zoom maximal
- `-s EPSG:3857` : projection correcte pour MVT
- `-l` : spécifie le layer qui sera à exploiter dans le front pour afficher les tuiles
- `output_z13.mbtiles` : nom du fichier généré avec la taille de zoom maximal
- `--coalesce` : Fusionne les carrés de même valeur pour diviser drastiquement le nombre de géométries à afficher.
- `--no-line-simplification` : Maintient les bordures des blocs parfaitement droites et fidèles, ce qui empêche les "déchirures" entre les blocs voisins
- `-pf -pk` : Interdit à Tippecanoe d'abandonner des géométries si la tuile devient trop lourde. Peut être utile si une tuile rend de la donnée en gruyère.

**👉 Résultat :** un fichier `output_z13.mbtiles` dans le dossier.

---

## 3️⃣ Extraire les tuiles `{z}/{x}/{y}.pbf`

**But :** découper le fichier `.mbtiles` en fichiers individuels `.pbf`.

Aucune image Docker officielle n'existe pour `mbutil`, on utilise donc un container Python pour l'installer à la volée.

### Commande PowerShell (Windows)

```powershell
docker run --rm -it `
  -v "C:\path\to\folder:/data" `
  -w /data `
  python:3.10-slim `
  sh -c "pip install mbutil && mb-util --image_format=pbf output_z13.mbtiles tiles"
```

**👉 Résultat :** une structure de dossiers sur votre disque local :

```
path/to/folder/tiles/
    4/
    5/
    ...
    13/
        x/
            y.pbf
```

---

## 4️⃣ Upload sur S3

**But :** héberger les tuiles sur un bucket S3 pour les rendre accessibles via HTTP.

### Structure cible sur S3

```
s3://bucket/app/nom_indicateur/tiles/
```

### Avec un shell

**But :** Envoyer les tuiles avec le bon encoding

### Commande Git Bash

```shell
cd path/to/tiles/folder
```

```shell
aws s3 sync tiles/ s3://bucket/app/indicateur/tiles --content-type application/x-protobuf --content-encoding gzip --metadata-directive REPLACE --endpoint-url https://s3.fr-par.scw.cloud
```

**👉 URL finale des tuiles :**

```
https://bucket.s3.fr-par.scw.cloud/app/nom_indicateur/tiles/{z}/{x}/{y}.pbf
```

### Changement des CORS policy sur le bucket (https://www.scaleway.com/en/docs/object-storage/api-cli/setting-cors-rules/)

Créer un fichier JSON :

```json
{
    "CORSRules": [
        {
            "AllowedOrigins": [
                "http://MY_DOMAIN_NAME",
                "http://www.MY_DOMAIN_NAME"
            ],
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "MaxAgeSeconds": 3000,
            "ExposeHeaders": ["Etag"]
        }
    ]
}
```

Puis charger cette configuration :

```shell
aws s3api put-bucket-cors --bucket bucketname --cors-configuration file://cors.json --endpoint-url https://s3.fr-par.scw.cloud

```

Verification :

```shell
aws s3api get-bucket-cors --bucket bucketname --endpoint-url https://s3.fr-par.scw.cloud
```

## ✅ Vérification

### Tester une tuile individuelle

Ouvrir dans un navigateur :

```
https://bucket.s3.fr-par.scw.cloud/app/nom_indicateur/tiles/4/8/5.pbf
```

Le navigateur doit télécharger un fichier `.pbf` (format binaire).
