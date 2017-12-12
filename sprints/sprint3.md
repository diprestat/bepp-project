Sprint 3

### Mini Backlog

| ID | User Story | Difficulté | Priorité | Fait |
| --- | --- | --- | --- | --- |
| 7 | En tant que **développeur**, je souhaite pouvoir ajouter un sprint (Date début, durée) à un projet.| 1 | 3 | :x:
| 8 | En tant que **développeur**, je souhaite associer une ou plusieurs US à un sprint.| 1 | 3 | :x:
| 9 | En tant que **développeur**, je souhaite ajouter une tâche (Intitulé)  à la liste des tâches d'un sprint.| 1 | 3 | :x:  
| 10 | En tant que **développeur**, je souhaite modifier / supprimer une tâche de la liste des tâches d'un sprint.| 1 | 4 | :x:
| 19 | En tant qu'**Utilisateur**, je souhaite pouvoir obtenir la liste des US ciblées dans un Sprint d'un projet.| 2 | 4 | :x:
| 20 | En tant qu'**Utilisateur**, je souhaite pouvoir obtenir la liste des tâches d'un sprint d'un projet avec pour chaque tâche l'assignation, l'état et la date de début/fin.| 2 | 4 | :x:

### Tâches

| ID_Tache | Description | Affectation | Durée Estimée ( heure homme ) | US Associés | Etat |
| --- | --- | --- | --- | --- | --- |
| T1_TEST | Implémenter les tests E2E sur Travis | Dimitri | 2 |  | :x:
| T2_BUILD | Améliorer l'intégration d'Angular dans Docker | Dimitri | 1 |  | :x:
| T3_DELIVERY | Changer le système de releases d'une archive à une image Docker | Dimitri | 1 |  | :x:
| T4_DEPLOY | Intégrer à Travis un déploiement continu à l'aide d'heroku | Dimitri | 3 |  | :x:
| T5_P | Créer l'interface Front-end de creation des tâches<br><ul><li>Création d'une interface permettant aux utilisateur de remplir les champs 'description', 'difficulté' et 'tâches reliés' afin de créer une tâche</li></ul> | Amine | 2 | 9 | :white_check_mark:
| T6_P | Créer l'interface Front-end de modification/suppression d'une tâche : <br><ul><li>Bouton suppression</li><li>Bouton modification</li><li>des inputs pour la modification</li><li>Bouton pour assigner la tâche</li></ul> | Amine | 2 | 10 | :white_check_mark:
| T7_P | Créer l'interface Front-end pour la modification des sprints<br><ul><li>Modification des dates : début et fin de sprint.</li></ul> | Amine | 3 | 7 - 8 | :white_check_mark:
| T8_GITFLOW | Mettre la structure du gestion de projet sur Github 'projects' | Amine | 3 |  | :white_check_mark:
| T9_DOC | Compléter le Swagger afin d'intégrer les nouveaux services |  | 2 | 1 | :x:
| T10_M | Service PATCH du modification du nombre de sprints et de leurs durées  |  | 2 | 1 | :x:
| T11_M | Service POST de création d'un sprint  |  | 2 | 1 | :x:
| T12_M | Service GET de recuperation des US d'un sprint  |  | 2 | 1 | :x:
| T13_M | Service GET de recuperation des taches d'un sprint  |  | 2 | 1 | :x:
| T14_M | Service PATCH d'ajout d'US à un sprint  |  | 2 | 1 | :x:
| T15_M | Service PATCH d'ajout de tâches à un sprint  |  | 2 | 1 | :x:
| T16_M | Service PATCH de modification de tâches dans un sprint  |  | 2 | 1 | :x:
| T17_M | Service PATCH de suppression de tâches dans un sprint  |  | 2 | 1 | :x:
| T18_PM | Ajouter dans la création de projet, le nombre et la durée des sprints |  | 2 | 7 | :x:
| T19_PM | Créer le formulaire TS d'ajout d'US à un sprint |  | 2 | 8 | :x:
| T20_PM | Créer le formulaire TS d'ajout de tâche à un sprint |  | 2 | 9 | :x:
| T21_PM | Créer le formulaire TS de modification d'une tâche (dans un sprint) |  | 2 | 10 | :x:
| T22_PM | Lier le bouton de suppression d'une tâches au service REST adéquat |  | 2 | 10 | :x:
| T23_PM | Afficher la liste des US fournies par l'API |  | 2 | 19 | :x:
| T24_TEST | Redaction des tests E2E | Amine | 2 |  | :white_check_mark:
| T25_TEST | Execution des tests E2E | Amine | 4 |  | :white_check_mark:

### Organisation des tâches

Mis en place avec les onglets `issues` et `projects` de github.

Timeline et Kanban sur le [lien suivant](sprint3/organisation.md).

### Les tests E2E

sur le [lien suivant](sprint3/tests.md).

### Les dépendances entre les tâches.

sur le [lien suivant](sprint3/dependance.md).