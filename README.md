# Linquedine
Jean-Sébastien Merz
Installation:
Je ne sais pas me servir assez bien de docker, j'ai donc utilisé npm en local sur mon windows.
- Dans la racine du projet, il faut lancer l'instruction npm update pour installer toutes les dépendances nécessaires.
- Il faut ensuite lancer un docker d'elasticSearch avec la commande suivante: 
docker run -p 9200:9200 -e "http.host=0.0.0.0" -e "transport.host=127.0.0.1" -e "http.cors.enabled=true" -e "http.cors.allow-origin=*" --name elasticsearch docker.elastic.co/elasticsearch/elasticsearch:6.5.4
En effet, les options cors permettent de faire des requetes API via nodeJS.

Executer ensuite: node init.js
Il permet d'inclure les fichiers Json fournis dans la base elasticSearch.

Enfin, executer : node app.js

adresse de l'appli: http://localhost:3000

FONCTIONNALITES:
- Recherche dans plusieurs champs (nom, prénom, société, domaine d'activité, poste) depuis la barre de recherche
- Filtres par sociétés ou employés, par type d'activité ou par métier
- Affichage et recherche sur une carte
-CRUD complet pour gérer les employés

BUG rencontré:
Le plus gênant, que je n'ai plus le temps de corriger, c'est de devoir recharger la page d'accueil du crud après une modif,
pour que celle-ci apparaisse dans le crud.

Axes d'amélioration:
Meilleure gestion des filtres,
CRUD pour les entreprises
Gérer la pagination des résultats


Dépôt disponible sur https://github.com/jeanseo/Linquedine/
