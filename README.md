![mern_ai](https://github.com/user-attachments/assets/e1d03ca8-f9fc-4443-b692-738e2f57b621)# Intégration d’Intelligence Artificielle avec Gemini

## Présentation
Ce projet ajoute des fonctionnalités d’IA générative à EduPlatform (stack MERN) via l’API Google Gemini, sans modifier le périmètre fonctionnel du cours.

## Objectifs
- Intégrer une API d’IA générative dans une application MERN
- Exposer des routes backend dédiées à l’IA et les consommer côté React
- Mettre en pratique les concepts vus en cours sur un projet web complet

## Fonctionnalités IA
1. Analyse des reviews d’un cours : sentiment, moyenne, points forts/faibles, recommandations, affichage frontend
2. Génération automatique de description de cours à partir du titre, de l’instructeur et des mots-clés
3. Suggestions de cours similaires basées sur le contenu et les cours disponibles
4. Génération de bio professionnelle à partir du profil utilisateur
5. Insights globaux agrégés pour l’administration

## Intégration
- IA uniquement côté serveur (Node.js), clé API stockée dans `.env`
- Prompts structurés, gestion des appels asynchrones et des erreurs
- Le frontend consomme uniquement les routes exposées

## Organisation
- Backend : configuration Gemini, contrôleurs IA, routes dédiées
- Frontend : pages et composants React pour déclencher l’IA et afficher les résultats

## Démonstration vidéo
- `assets/mern_ai.mp4` : analyse des reviews, génération de description, suggestions de cours

## Conclusion
L’intégration de Gemini automatise l’analyse de texte, améliore l’expérience utilisateur et apporte des fonctionnalités à forte valeur ajoutée à EduPlatform.
<img width="1317" height="896" alt="1" src="https://github.com/user-attachments/assets/bfc42897-f8dd-4982-af13-95067df09260" />
<img width="1142" height="752" alt="2" src="https://github.com/user-attachments/assets/e584f629-f0fe-4b88-b680-480b988bc68e" />




_Hedyene Mili_
