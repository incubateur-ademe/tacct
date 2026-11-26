SELECT COUNT(*) AS nb_lignes
FROM tacct."user"
WHERE 1 = 1
  [[ AND {{periode}} ]];
