# Déploiement — Formulaire d'évaluation Maraîchage Occitanie

Site statique (GitHub Pages) + collecteur Google Sheet (Apps Script). Choix libre des questions.

## Contenu du dossier
- `index.html` — le formulaire (n° évaluateur → profil → menu des 12 questions → évaluation).
- `content.js` — les 12 questions, leurs nuggets (20/question) et les 2 réponses A/B (openai sans RAG / mistral-fast avec RAG).
- `config.js` — réglages (à compléter : ENDPOINT après déploiement Apps Script).
- `apps_script_Code.gs` — collecteur à coller dans la feuille Google.
- `QR_evaluateurs.html` — génère les 10 QR codes (un par évaluateur).

## Étape 1 — Collecteur Google Sheet (Apps Script)
1. Ouvre TA feuille Google (résultats Occitanie).
2. Menu **Extensions → Apps Script**. Supprime le code par défaut, colle tout `apps_script_Code.gs`. Enregistre.
3. **Déployer → Nouveau déploiement → Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
4. Autorise (compte naudin@cirad.fr). Copie l'**URL /exec**.
5. Colle cette URL dans `config.js` → `ENDPOINT`.
(Le script est lié à la feuille : il crée 2 onglets `reponses` et `nuggets`. Pas d'ID à renseigner.)

## Étape 2 — Publier le site (GitHub Desktop)
1. Copie ce dossier `maraichage-occitanie/` dans ton dépôt GitHub local (à côté du site Madagascar).
2. GitHub Desktop : **Commit** (« ajout site Maraîchage Occitanie ») puis **Push**.
3. GitHub Pages publie sous : `https://<utilisateur>.github.io/<repo>/maraichage-occitanie/`.

## Étape 3 — Diffuser aux évaluateurs
1. Ouvre `QR_evaluateurs.html`, mets l'URL de base déployée, **Générer** puis **Imprimer**.
2. Chaque évaluateur scanne SON QR (n° 1 à 10) → tombe sur le formulaire.
3. Les réponses arrivent en direct dans la feuille Google (onglets `reponses` + `nuggets`).

## Test à blanc recommandé
Avant l'atelier : ouvrir `?ev=01`, évaluer 1 question, envoyer, vérifier l'arrivée d'une ligne dans `reponses` et de lignes dans `nuggets`.
