SELECT
  CASE profil
    WHEN 'cdm'         THEN 'Chargé·e de mission en collectivité'
    WHEN 'elu'         THEN 'Élu·e d’une collectivité'
    WHEN 'responsable' THEN 'Responsable en collectivité'
    WHEN 'be'          THEN 'Bureau d’études'
    WHEN 'entreprise'  THEN 'Entreprise'
    WHEN 'admin'       THEN 'Administration centrale'
    WHEN 'etat'        THEN 'DDT/DDTM/DREAL'
    WHEN 'autre'       THEN 'Autre'
  END AS profil,
  COUNT(*) AS nombre_comptes
FROM tacct."user"
WHERE profil IS NOT NULL
  AND roles NOT LIKE '%ROLE_ADMIN%'
GROUP BY 1
ORDER BY nombre_comptes DESC;
