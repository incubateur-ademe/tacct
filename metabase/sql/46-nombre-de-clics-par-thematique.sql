SELECT thematique, COUNT(*) AS count
FROM analytics.thematique
WHERE 1=1
  [[ AND {{periode}} ]]
GROUP BY thematique
ORDER BY count DESC;
