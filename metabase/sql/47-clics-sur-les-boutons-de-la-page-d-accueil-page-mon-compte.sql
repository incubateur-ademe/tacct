SELECT 
    CASE 
        WHEN event IN ('bouton_inscription_session_mon_compte', 'bouton_inscription_session_home') THEN 'Inscription session accueil'
        WHEN event = 'bouton_decouvrir_ressources_home' THEN 'Ressources'
        WHEN event = 'bouton_rejoindre_communaute_home' THEN 'Rejoindre la communauté'
        WHEN event = 'bouton_connexion_mon_compte' THEN 'Connexion à mon compte'
        WHEN event = 'click_bouton_mon_compte_header' THEN 'Mon compte (header)'
        WHEN event = 'bouton_decouvrir_patch4_home' THEN 'Patch 4°C'
        ELSE event
    END AS event,
    COUNT(*) AS count
FROM analytics.boutons_homepage
WHERE event != 'bouton_evaluer_diagnostic_home'
  [[ AND {{periode}} ]]
GROUP BY 
    CASE 
        WHEN event IN ('bouton_inscription_session_mon_compte', 'bouton_inscription_session_home') THEN 'Inscription session accueil'
        WHEN event = 'bouton_decouvrir_ressources_home' THEN 'Ressources'
        WHEN event = 'bouton_rejoindre_communaute_home' THEN 'Rejoindre la communauté'
        WHEN event = 'bouton_connexion_mon_compte' THEN 'Connexion à mon compte'
        WHEN event = 'click_bouton_mon_compte_header' THEN 'Mon compte (header)'
        WHEN event = 'bouton_decouvrir_patch4_home' THEN 'Patch 4°C'
        ELSE event
    END
ORDER BY count DESC;
