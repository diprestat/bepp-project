## Sprint 2

### Mini Backlog

| ID | User Story | Difficulté | Priorité | Fait |
| --- | --- | --- | --- | --- |
| 5 | En tant que **développeur**, je souhaite ajouter une User Story (Description, Difficulté (Suite de Fibonacci)) au BackLog d'un projet.| 1 | 2 | :white_check_mark:
| 6 | En tant que **développeur**, je souhaite pouvoir modifier / supprimer une US du Backlog d'un projet.| 1 | 2 | :white_check_mark:
| 7 | En tant que **développeur**, je souhaite pouvoir ajouter un sprint (Date début, durée) à un projet.| 1 | 3 | :x:
| 8 | En tant que **développeur**, je souhaite associer une ou plusieurs US à un sprint.| 1 | 3 | :x:
| 18 | En tant qu'**Utilisateur**, je souhaite pouvoir obtenir la liste des US contenues dans le Backlog d'un projet.| 2 | 4 | :white_check_mark:
| 23 | En tant que **Product Owner**, je souhaite pouvoir saisir et modifier les priorités des US.| 1 | 2 | :white_check_mark:

### Tâches

| ID_Tache | Description | Affectation | Durée Estimée ( heure homme ) | US Associés | Etat |
| --- | --- | --- | --- | --- | --- |
| T1_BUILD | Mettre en place le conteneur "Docker" pour Angular | Dimitri | 4 | ∅ | :white_check_mark:
| T2_BUILD | Mettre en place le conteneur "Docker" pour Mongo | Dimitri | 2 | ∅ | :white_check_mark:
| T3_BUILD | Mettre en place le conteneur "Docker" pour Express | Dimitri | 4 | ∅ | :white_check_mark:
| T4_TEST | Mise en place de "Travis" | Dimitri | 2 | ∅ | :white_check_mark:
| T5_TEST | Mise en place de "Travis" pour exécuter les tests Mocha| Dimitri | 2 | ∅ | :white_check_mark:
| T6_TEST | Mise en place de "Travis" pour exécuter les tests E2E| Dimitri | 2 | ∅ | :x:
| T7_DELIVERY | Configuer Travis pour déployer des releases | Dimitri | 3 | ∅ | :white_check_mark:
| T8_P | Créer l'interface Front-end du Backlog contenant : <br><ul><li>Une liste des US associées au Projet</li><li>Un button pour permettre a l'utilisateur de créer une US(Description, Difficulté(suite de fibonacci), Priorité)</li><li>Un button pour permettre a l'utilisateur de modifier une US</li><li>Un button pour permettre a l'utilisateur de supprimer une US</li></ul>| Amine | 2 | 1 | :white_check_mark:
| T9_P | Créer l'interface Front-end pour les sprint <br><ul><li>Un dropdown listant l'ensemble des sprints</li><li>Des inputs dans le panel du creation du projet pour les sprints (Nombre, Durée)</li></ul> | Amine | 1 | 3 | :white_check_mark:
| T10_P | Créer l'interface Front-end d'un sprint contenant : <br><ul><li>Une liste des US associées au sprint</li></ul>| Amine | 2 | 1 | :white_check_mark:
| T11_P | Créer l'interface Front-end de modification/suppression d'une US du backlog d'un projet| Amine | 2 | 1 | :white_check_mark:
| T12_P | Créer l'interface Front-end de saisie et modification de la priorité d'une US du projet| Amine | 2 | 1 | :white_check_mark:
| T13_MB | Définir les requêtes (MongoDB) dont on aura besoin pour chaque service:<br><ul><li>Compléter le service REST qui insère une US dans la BD(création d'une US -US5)</li><li>Compléter le service REST qui modifie une US dans la BD à partir d'un utilisateur DEV(modification d'une US -US6)</li><li>Compléter le service REST qui supprime une US dans la BD(suppression d'une US -US6)</li><li>Compléter le service REST qui insère un sprint dans la BD(création d'un sprint -US7)</li><li>Compléter le service REST qui recupere la liste des US d'un projet(lister les US d'un projet -US18)</li><li>Compléter le service REST qui modifie une US dans la BD à partir d'un utilisateur PO(modification d'une US -US23)</li></ul>| Mathieu | 4 | 1 | :white_check_mark:
| T15_M | Service REST PUT  : Créer une US | Mathieu | 3 | 1 | :white_check_mark:
| T16_M | Service REST PATCH  : Modifier une US | Mathieu | 3 | 1 | :white_check_mark:
| T17_M | Service REST DELETE  : Supprimer une US | Mathieu | 3 | 1 | :white_check_mark:
| T18_M | Service REST PATCH  : Mettre à jour le nombre de sprints | Mathieu |  | 1 | :x:
| T19_M | Service REST PATCH  : Associer une US à un sprint | Mathieu |  | 1 | :x:
| T20_M | Service REST PATCH  : Modifier la priorité d'une US (Vérification Authentification PO) | Mathieu | 2 | 1 | :x:
| T21_DOC | La documentation des services "SWAGGER"| Mathieu | 3 | 1 | :white_check_mark:
| T22_TEST | Redaction des tests : E2E(Protractor)| Amine | 2 | 1 | :white_check_mark:
| T23_TEST | Effectuer les tests : E2E(Protractor)| Amine | 2 | 1 | :x:
| T24_PM | Faire le lien entre l'interface de la tâche T8_P et les services de l'api| Adrien | 4 | 1 | :white_check_mark:
| T25_PM | Faire le lien entre l'interface de la tâche T9_P et les services de l'api| Adrien | 2 | 1 | :x:
| T26_PM | Faire le lien entre l'interface de la tâche T10_P et les services de l'api| Adrien | 2 | 1 | :x:
| T27_PM | Faire le lien entre l'interface de la tâche T11_P et les services de l'api| Adrien | 3 | 1 | :white_check_mark:
| T28_PM | Faire le lien entre l'interface de la tâche T12_P et les services de l'api| Adrien | 2 | 1 | :white_check_mark:

### Les tests E2E

sur le [lien suivant](sprint2/tests.md).

### Les dépendances entre les tâches.

sur le [lien suivant](sprint2/dependance.md).

### L'organisation des tâches : Timeline et Kanban

sur le [lien suivant](sprint2/organisation.md).


